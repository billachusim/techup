import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useServerFn } from "@tanstack/react-start";
import { onboardStudent } from "@/lib/student-onboarding.functions";
import { getSupabase, mightHaveSession } from "@/integrations/supabase/lazy";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";
import { rememberCheckout, trackEvent } from "@/lib/analytics";
import {
  FREE_BOOTCAMP_HASH,
  START_FREE_BOOTCAMP_EVENT,
} from "@/lib/free-bootcamp";
import { FREE_PLAN_ID, PLAN_TITLES, draftFor, type EnrolDraft } from "@/lib/programmes";
import {
  INSTALMENTS,
  LEARNING_MODES,
  PLAN_NAMES,
  PLAN_PRICING,
  PROMO_CODES,
  REFERRAL_DISCOUNT_PERCENT,
  instalmentSplit,
  priceSelection,
} from "../../../supabase/functions/_shared/pricing.ts";
import {
  grantsAccess,
  isFreePlan,
} from "../../../supabase/functions/_shared/enrollment-access.ts";
import { PlanSheet } from "./PlanSheet";
import { AuthDialog } from "./AuthDialog";
import { CheckoutDialog } from "./CheckoutDialog";

interface EnrolContextValue {
  /** Opens enrolment for a plan; the free plan enrols straight away. */
  open: (planId: string) => void;
}

const EnrolContext = createContext<EnrolContextValue | null>(null);

export const useEnrol = () => {
  const value = useContext(EnrolContext);
  if (!value) throw new Error("useEnrol must be used inside EnrolProvider");
  return value;
};

const REFERRAL_STORAGE_KEY = "tf_referral_code";
// A visitor who has to sign up first (or sign in with Google, which leaves
// the page) picks up where they left off when they come back signed in.
const PENDING_KEY = "tf_pending_enrol";
const PENDING_MAX_AGE_MS = 2 * 60 * 60 * 1000;

const WHATSAPP_NUMBER = "2348068597140";


function savePending(draft: EnrolDraft) {
  try {
    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify({ draft, at: Date.now() }),
    );
  } catch {
    // Storage can be blocked; the visitor can still press Enrol again.
  }
}

function takePending(): EnrolDraft | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    localStorage.removeItem(PENDING_KEY);
    if (!raw) return null;
    const { draft, at } = JSON.parse(raw) as { draft: EnrolDraft; at: number };
    if (Date.now() - at > PENDING_MAX_AGE_MS || !PLAN_PRICING[draft?.planId])
      return null;
    return draft;
  } catch {
    return null;
  }
}

async function signedInUser() {
  if (!mightHaveSession()) return null;
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

interface EnrolProviderProps {
  children: ReactNode;
  /** Start the free plan when the homepage bootcamp card asks (or the page opens at /#free-bootcamp). */
  handleFreeBootcamp?: boolean;
}

export const EnrolProvider = ({
  children,
  handleFreeBootcamp = false,
}: EnrolProviderProps) => {
  const { toast } = useToast();
  const { formatPrice, isNigeria } = useCurrency();
  const runOnboarding = useServerFn(onboardStudent);

  const [draft, setDraft] = useState<EnrolDraft | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customised = useRef(false);

  const [discountCode, setDiscountCode] = useState("");
  const [requestDiscount, setRequestDiscount] = useState(false);
  // Whether the typed code is a graduate's referral code (null: not checked).
  const [referralValid, setReferralValid] = useState<boolean | null>(null);

  // A graduate's share link (?ref=CODE) fills in their code, and it is kept
  // for later visits in case the student signs up first.
  useEffect(() => {
    try {
      const fromLink = new URLSearchParams(window.location.search)
        .get("ref")
        ?.trim()
        .toUpperCase();
      if (fromLink) localStorage.setItem(REFERRAL_STORAGE_KEY, fromLink);
      const code = fromLink || localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (code) setDiscountCode((current) => current || code);
    } catch {
      // Storage can be blocked; the code can still be typed in.
    }
  }, []);

  const typedCode = discountCode.trim().toUpperCase();
  useEffect(() => {
    if (!typedCode || PROMO_CODES[typedCode]) {
      setReferralValid(null);
      return;
    }
    setReferralValid(null);
    let active = true;
    const timer = setTimeout(async () => {
      const supabase = await getSupabase();
      const { data } = await supabase.rpc("referral_code_exists", {
        _code: typedCode,
      });
      if (active) setReferralValid(data === true);
    }, 400);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [typedCode]);

  // What the page shows; create-checkout re-checks the code and charges.
  const discountPercent =
    PROMO_CODES[typedCode] ?? (referralValid ? REFERRAL_DISCOUNT_PERCENT : 0);
  const codeStatus: "none" | "checking" | "valid" | "invalid" = !typedCode
    ? "none"
    : PROMO_CODES[typedCode] || referralValid
      ? "valid"
      : referralValid === null
        ? "checking"
        : "invalid";

  const priced = draft
    ? priceSelection(
        draft.planId,
        draft.courseIds,
        draft.benefitIds,
        draft.learningModeId || null,
      )
    : null;
  const fullTotal = priced?.ok ? priced.total : 0;
  const total = Math.round((fullTotal * (100 - discountPercent)) / 100);

  const updateDraft = (next: EnrolDraft) => {
    if (!customised.current && draft) {
      customised.current = true;
      trackEvent("customise_plan", { item_id: draft.planId });
    }
    setDraft(next);
  };

  /** Whether this student may start the plan; says why not when they can't. */
  const mayEnrol = async (planId: string) => {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile } = await supabase
      .from("profiles")
      .select("faculty_id")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.faculty_id) return true;
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("plan_name, status")
      .eq("faculty_id", profile.faculty_id)
      .order("created_at", { ascending: false });
    // Only a confirmed payment counts, so an abandoned checkout can be retried.
    const paidPlan = enrollments?.find(
      (e) => !isFreePlan(e.plan_name) && grantsAccess(e),
    );
    if (paidPlan) {
      toast({
        title: "You already have a paid plan",
        description:
          "To change or add a plan, message us on WhatsApp and we'll set it up.",
      });
      return false;
    }
    if (
      planId === FREE_PLAN_ID &&
      enrollments?.some((e) => isFreePlan(e.plan_name) && grantsAccess(e))
    ) {
      toast({
        title: "You're already in the Free Tech Bootcamp",
        description: "Your lessons are on your dashboard.",
      });
      window.location.assign("/dashboard");
      return false;
    }
    return true;
  };

  /**
   * Saves the enrolment: a new Faculty ID for the plan, the enrolment row, and
   * then a card checkout, a WhatsApp or email request, or (free plan) access.
   */
  const submit = async (
    current: EnrolDraft,
    method: "email" | "whatsapp" | "card" | "free",
    payInInstalments = false,
  ) => {
    setIsSubmitting(true);
    const isFree = current.planId === FREE_PLAN_ID;
    const planName = PLAN_NAMES[current.planId];
    const planTitle = PLAN_TITLES[current.planId] ?? planName;
    const selection = priceSelection(
      current.planId,
      current.courseIds,
      current.benefitIds,
      current.learningModeId || null,
    );
    const amount = selection.ok
      ? Math.round((selection.total * (100 - discountPercent)) / 100)
      : 0;

    try {
      if (!selection.ok) throw new Error(selection.error);
      const supabase = await getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to enrol");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (!profile) throw new Error("Profile not found");

      const currentFacultyId = profile.faculty_id;
      const selectedMode =
        LEARNING_MODES.find((m) => m.id === current.learningModeId)?.name ||
        "online-only";

      // Generate new faculty ID with enrollment details
      const { data: newFacultyId, error: idError } = await supabase.rpc(
        "generate_faculty_id",
        {
          dept_name: planName,
          learn_mode: selectedMode,
          cohort_mo: new Date().getMonth() + 1,
          cohort_yr: new Date().getFullYear(),
        },
      );
      if (idError || !newFacultyId) {
        console.error("Error generating new faculty ID:", idError);
        throw new Error("Failed to generate faculty ID");
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          faculty_id: newFacultyId,
          department: planName,
          learning_mode: selectedMode,
          cohort_month: new Date().getMonth() + 1,
          cohort_year: new Date().getFullYear(),
        })
        .eq("id", user.id);
      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw new Error("Failed to update profile");
      }

      // Record the Faculty ID itself via a secure function (direct writes are blocked)
      const { error: recordError } = await supabase.rpc(
        "record_my_faculty_id",
        {
          // The generated types say string, but the SQL function treats null as "no previous ID"
          _old_id: (currentFacultyId ?? null) as string,
          _department: planName,
        },
      );
      if (recordError) {
        console.error("Error recording faculty ID:", recordError);
        throw new Error("Failed to save Faculty ID");
      }

      if (currentFacultyId) {
        // Carry existing records over to the new Faculty ID
        await Promise.all([
          supabase
            .from("enrollments")
            .update({ faculty_id: newFacultyId, learning_mode: selectedMode })
            .eq("faculty_id", currentFacultyId),
          supabase
            .from("course_enrollments")
            .update({ faculty_id: newFacultyId })
            .eq("faculty_id", currentFacultyId),
          supabase
            .from("course_progress")
            .update({ faculty_id: newFacultyId })
            .eq("faculty_id", currentFacultyId),
        ]);
      }

      // Free plans start straight away. A paid plan stays pending until its
      // payment is confirmed: card checkouts are saved by create-checkout and
      // activated by Flutterwave's confirmation, WhatsApp/email ones by an admin.
      if (isFree || method !== "card") {
        const { error: enrollError } = await supabase
          .from("enrollments")
          .insert({
            faculty_id: newFacultyId,
            plan_name: planName,
            status: isFree ? "active" : "pending",
            learning_mode: selectedMode,
            // Lets the server price the request and email a pay link if it stays unpaid.
            requested_selection: isFree
              ? null
              : {
                  planId: current.planId,
                  courseIds: current.courseIds,
                  benefitIds: current.benefitIds,
                  learningModeId: current.learningModeId || null,
                  currency: isNigeria ? "NGN" : "USD",
                  discountCode: discountCode.trim() || null,
                  discountRequested: requestDiscount || false,
                },
          });
        if (enrollError) {
          console.error("Error creating enrollment:", enrollError);
          throw new Error("Failed to save your enrollment");
        }
      }

      // Slack class group + welcome email (best effort, never blocks enrolment)
      try {
        await runOnboarding();
      } catch (onboardErr) {
        console.warn("Student onboarding automation failed:", onboardErr);
      }

      if (isFree) {
        trackEvent("join_free_bootcamp", { item_id: current.planId });
        toast({
          title: "You're in the Free Tech Bootcamp!",
          description: `Your Faculty ID is ${newFacultyId}. Opening your dashboard…`,
        });
        setTimeout(() => window.location.assign("/dashboard"), 1500);
        return;
      }

      trackEvent("add_payment_info", {
        value: amount,
        currency: "NGN",
        payment_type: method,
        items: [{ item_id: current.planId, item_name: planTitle }],
      });

      if (method === "card") {
        const { data: checkoutData, error: checkoutError } =
          await supabase.functions.invoke("create-checkout", {
            body: {
              planId: current.planId,
              planName: planTitle,
              facultyId: newFacultyId,
              // The server looks up prices from these ids itself
              courseIds: current.courseIds,
              benefitIds: current.benefitIds,
              learningModeId: current.learningModeId || null,
              currencyCode: isNigeria ? "NGN" : "USD",
              discountCode: discountCode || "",
              payInInstalments: payInInstalments || undefined,
              successUrl: `${window.location.origin}/payment-success`,
              cancelUrl: `${window.location.origin}${window.location.pathname}#pricing`,
            },
          });

        const checkoutUrl = checkoutData?.url?.trim();
        if (checkoutError || !checkoutUrl) {
          throw new Error(
            checkoutData?.error ||
              checkoutError?.message ||
              "Failed to create checkout session",
          );
        }
        if (!/^https?:\/\//i.test(checkoutUrl)) {
          throw new Error("Invalid checkout link received. Please try again.");
        }

        try {
          // The code has been used; don't prefill it on this student's next plan.
          localStorage.removeItem(REFERRAL_STORAGE_KEY);
        } catch {
          // Storage can be blocked.
        }
        rememberCheckout({ plan: planTitle, value: amount, currency: "NGN" });
        setCheckoutOpen(false);
        window.location.assign(checkoutUrl);
        return;
      }

      const courseNames = selection.courses.map((c) => c.name);
      const extras = selection.benefits.filter((b) => b.price > 0);
      const mode = selection.learningMode;
      const discountInfo = requestDiscount
        ? "\n*Requesting Discount Code*"
        : discountCode
          ? `\n*Discount Code Applied:* ${discountCode.toUpperCase()}`
          : "";

      const message = `Hello Tech Faculty! 👋

My name is ${profile.name} and I am ready to make payment for the *${planTitle}* programme.

Here are my enrollment details:

*Faculty ID:* ${newFacultyId}${currentFacultyId ? `\n*(Previous ID: ${currentFacultyId})*` : ""}
*Programme:* ${planTitle}
*Total:* ${formatPrice(amount)}${discountInfo}

*Courses:*
${courseNames.length > 0 ? courseNames.map((c) => `✓ ${c}`).join("\n") : "No courses selected"}

*Study mode:* ${mode?.name ?? "Online Only"} - ${!mode || mode.price === 0 ? "Included" : formatPrice(mode.price)}

*Extras:*
${extras.length > 0 ? extras.map((b) => `✓ ${b.name} - ${formatPrice(b.price)}`).join("\n") : "None"}

Please share the payment details so I can complete my enrollment. Thank you!`;

      if (method === "whatsapp") {
        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
          "_blank",
        );
        toast({
          title: "Enrollment submitted!",
          description: `Your new Faculty ID is ${newFacultyId}. Complete the request on WhatsApp.`,
        });
      } else {
        const emailSubject = `Enrollment Request - ${newFacultyId} - ${planTitle}`;
        const emailBody = message.replace(/\*/g, "").replace(/✓/g, "-");
        window.location.href = `mailto:thetechfaculty@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        toast({
          title: "Enrollment submitted!",
          description: `Your new Faculty ID is ${newFacultyId}. Complete the request via email.`,
        });
      }

      setCheckoutOpen(false);
      setIsSubmitting(false);
      // Reload to refresh user context with new faculty ID
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Enrollment error:", error);
      toast({
        title: "Enrollment failed",
        description:
          (error instanceof Error && error.message) ||
          "An error occurred during enrollment",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  /** Once signed in: the free plan enrols at once, a paid plan goes to payment. */
  const continueSignedIn = async (current: EnrolDraft) => {
    if (!(await mayEnrol(current.planId))) return;
    if (current.planId === FREE_PLAN_ID) {
      toast({ title: "Setting up your Free Tech Bootcamp…" });
      await submit(current, "free");
      return;
    }
    const selection = priceSelection(
      current.planId,
      current.courseIds,
      current.benefitIds,
      current.learningModeId || null,
    );
    trackEvent("begin_checkout", {
      value: selection.ok ? selection.total : 0,
      currency: "NGN",
      items: [
        { item_id: current.planId, item_name: PLAN_TITLES[current.planId] },
      ],
    });
    setSheetOpen(false);
    setCheckoutOpen(true);
  };

  /** Signs the visitor up (or in) first when needed, then carries on. */
  const proceed = async (current: EnrolDraft) => {
    setDraft(current);
    const user = await signedInUser();
    if (user) {
      await continueSignedIn(current);
      return;
    }
    savePending(current);
    trackEvent("enrol_sign_in_prompt", { item_id: current.planId });
    setSheetOpen(false);
    setAuthOpen(true);
  };

  const proceedRef = useRef(proceed);
  proceedRef.current = proceed;
  const continueRef = useRef(continueSignedIn);
  continueRef.current = continueSignedIn;

  const open = useCallback((planId: string) => {
    if (!PLAN_PRICING[planId]) return;
    trackEvent("select_plan", {
      item_id: planId,
      item_name: PLAN_TITLES[planId],
    });
    const fresh = draftFor(planId);
    customised.current = false;
    setDraft(fresh);
    if (planId === FREE_PLAN_ID) {
      void proceedRef.current(fresh);
      return;
    }
    setSheetOpen(true);
  }, []);

  const onAuthSuccess = () => {
    setAuthOpen(false);
    const pending = takePending() ?? draft;
    if (pending) void continueRef.current(pending);
  };

  // Back from Google sign-in or the email confirmation link: carry on.
  useEffect(() => {
    if (!mightHaveSession()) return;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(PENDING_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    void (async () => {
      const user = await signedInUser();
      if (!user) return;
      const pending = takePending();
      if (!pending) return;
      setDraft(pending);
      document.getElementById("pricing")?.scrollIntoView();
      void continueRef.current(pending);
    })();
  }, []);

  // The homepage Free Tech Bootcamp card (and /#free-bootcamp links) start the
  // free plan: signed-in students are enrolled straight away, everyone else
  // signs up first and enrolment continues once the account exists.
  useEffect(() => {
    if (!handleFreeBootcamp) return;
    const start = () => {
      document.getElementById("pricing")?.scrollIntoView();
      open(FREE_PLAN_ID);
    };
    window.addEventListener(START_FREE_BOOTCAMP_EVENT, start);
    if (window.location.hash === FREE_BOOTCAMP_HASH) start();
    return () => window.removeEventListener(START_FREE_BOOTCAMP_EVENT, start);
  }, [handleFreeBootcamp, open]);

  return (
    <EnrolContext.Provider value={{ open }}>
      {children}

      {draft && (
        <PlanSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          draft={draft}
          onChange={updateDraft}
          fullTotal={fullTotal}
          total={total}
          valid={!!priced?.ok}
          discountCode={discountCode}
          onDiscountCodeChange={setDiscountCode}
          codeStatus={codeStatus}
          discountPercent={discountPercent}
          requestDiscount={requestDiscount}
          onRequestDiscountChange={setRequestDiscount}
          onContinue={() => void proceed(draft)}
        />
      )}

      <AuthDialog
        open={authOpen}
        onOpenChange={(next) => {
          setAuthOpen(next);
          if (!next) takePending();
        }}
        planTitle={draft ? PLAN_TITLES[draft.planId] : undefined}
        free={draft?.planId === FREE_PLAN_ID}
        onSuccess={onAuthSuccess}
      />

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSubmit={(method, payInInstalments) =>
          draft && void submit(draft, method, payInInstalments)
        }
        totalAmount={total}
        instalment={instalmentSplit(total)}
        balanceDueDays={INSTALMENTS.balanceDueDays}
        isLoading={isSubmitting}
      />
    </EnrolContext.Provider>
  );
};
