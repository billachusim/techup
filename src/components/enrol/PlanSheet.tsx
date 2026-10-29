import { useState } from "react";
import { Check, ChevronDown, Search, Tag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  CUSTOM_PLAN_ID,
  PLAN_TITLES,
  departmentForPlan,
  type EnrolDraft,
  feeInstalments,
  planFee,
} from "@/lib/programmes";
import { cn } from "@/lib/utils";
import {
  ALL_COURSES,
  INSTALMENTS,
  PLAN_PRICING,
  REFERRAL_DISCOUNT_PERCENT,
  PROMO_CODES,
} from "../../../supabase/functions/_shared/pricing.ts";


interface PlanSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: EnrolDraft;
  onChange: (draft: EnrolDraft) => void;
  /** Before any discount. */
  fullTotal: number;
  total: number;
  /** Whether the selection can be checked out (a custom one must reach the minimum). */
  valid: boolean;
  discountCode: string;
  onDiscountCodeChange: (code: string) => void;
  codeStatus: "none" | "checking" | "valid" | "invalid";
  discountPercent: number;
  requestDiscount: boolean;
  onRequestDiscountChange: (value: boolean) => void;
  onContinue: () => void;
}

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

/** Choose a study mode and extras (or, for a custom programme, courses), then continue. */
export const PlanSheet = ({
  open,
  onOpenChange,
  draft,
  onChange,
  fullTotal,
  total,
  valid,
  discountCode,
  onDiscountCodeChange,
  codeStatus,
  discountPercent,
  requestDiscount,
  onRequestDiscountChange,
  onContinue,
}: PlanSheetProps) => {
  const { formatPrice } = useCurrency();
  const [showCourses, setShowCourses] = useState(false);
  const [showCode, setShowCode] = useState(!!discountCode);
  const [search, setSearch] = useState("");

  const plan = PLAN_PRICING[draft.planId];
  if (!plan) return null;
  const isCustom = draft.planId === CUSTOM_PLAN_ID;
  const department = departmentForPlan(draft.planId);
  const fee = planFee(draft.planId);
  const split = feeInstalments(total);
  const includedExtras = plan.benefits.filter((b) => b.price === 0);
  const paidExtras = plan.benefits.filter((b) => b.price > 0);
  const query = search.trim().toLowerCase();
  const customCourses = query
    ? ALL_COURSES.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.category?.toLowerCase().includes(query),
      )
    : ALL_COURSES;
  const typed = discountCode.trim().toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b px-6 pb-5 pt-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {department
              ? `${department.title} · ${department.duration}`
              : "Pick any courses"}
          </p>
          <SheetTitle className="text-2xl tracking-tight">
            {PLAN_TITLES[draft.planId]}
          </SheetTitle>
          <SheetDescription>
            {isCustom
              ? `Mix courses from every department. Programmes start from ${formatPrice(fee)}.`
              : `${formatPrice(fee)} covers all ${plan.courses.length} courses and your certificate. Start any time.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
          {isCustom ? (
            <section className="space-y-3">
              <h3 className="font-semibold">Your courses</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses or departments"
                  className="pl-9"
                  aria-label="Search courses"
                />
              </div>
              <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {customCourses.map((course) => {
                  const checked = draft.courseIds.includes(course.id);
                  return (
                    <li key={course.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
                          checked
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/40",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            onChange({
                              ...draft,
                              courseIds: toggle(draft.courseIds, course.id),
                            })
                          }
                        />
                        <span className="flex-1">
                          <span className="block text-sm font-medium">
                            {course.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {course.category}
                          </span>
                        </span>
                        <span className="text-sm font-semibold">
                          {formatPrice(course.price)}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : (
            <section>
              <button
                type="button"
                onClick={() => setShowCourses((v) => !v)}
                className="flex w-full items-center justify-between rounded-2xl bg-muted/60 px-4 py-3 text-left"
                aria-expanded={showCourses}
              >
                <span className="font-semibold">What's included</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showCourses && "rotate-180",
                  )}
                />
              </button>
              {showCourses && (
                <ul className="mt-3 grid gap-2 px-1 sm:grid-cols-2">
                  {[
                    ...plan.courses.map((c) => c.name),
                    ...includedExtras.map((b) => b.name),
                  ].map((name) => (
                    <li key={name} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section className="space-y-3">
            <h3 className="font-semibold">How do you want to study?</h3>
            <div className="grid gap-2">
              {plan.learningModes.map((mode) => {
                const selected = draft.learningModeId === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      onChange({ ...draft, learningModeId: mode.id })
                    }
                    aria-pressed={selected}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full border",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40",
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">{mode.name}</span>
                      <span className="block text-sm text-muted-foreground">
                        {mode.description}
                      </span>
                    </span>
                    <span className="text-sm font-semibold">
                      {mode.price ? `+${formatPrice(mode.price)}` : "Included"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {paidExtras.length > 0 && (
            <section className="space-y-3">
              <div>
                <h3 className="font-semibold">Optional extras</h3>
                <p className="text-sm text-muted-foreground">
                  Add any of these if they help you reach your goal.
                </p>
              </div>
              <div className="grid gap-2">
                {paidExtras.map((benefit) => {
                  const checked = draft.benefitIds.includes(benefit.id);
                  return (
                    <label
                      key={benefit.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                        checked
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/40",
                      )}
                    >
                      <Checkbox
                        className="mt-0.5"
                        checked={checked}
                        onCheckedChange={() =>
                          onChange({
                            ...draft,
                            benefitIds: toggle(draft.benefitIds, benefit.id),
                          })
                        }
                      />
                      <span className="flex-1">
                        <span className="block font-medium">
                          {benefit.name}
                        </span>
                        {benefit.description && (
                          <span className="block text-sm text-muted-foreground">
                            {benefit.description}
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-semibold">
                        +{formatPrice(benefit.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            {showCode ? (
              <div className="space-y-2">
                <Label htmlFor="enrol-code" className="font-semibold">
                  Discount or referral code
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="enrol-code"
                    value={discountCode}
                    onChange={(e) => onDiscountCodeChange(e.target.value)}
                    placeholder="e.g. a graduate's referral code"
                    autoComplete="off"
                  />
                  {codeStatus !== "none" && (
                    <span
                      className={cn(
                        "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
                        codeStatus === "valid" && "bg-primary/10 text-primary",
                        codeStatus === "invalid" &&
                          "bg-destructive/10 text-destructive",
                        codeStatus === "checking" &&
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {codeStatus === "checking"
                        ? "Checking…"
                        : codeStatus === "invalid"
                          ? "Not valid"
                          : PROMO_CODES[typed]
                            ? `${PROMO_CODES[typed]}% off`
                            : `${REFERRAL_DISCOUNT_PERCENT}% off · referral`}
                    </span>
                  )}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={requestDiscount}
                    onCheckedChange={(v) => onRequestDiscountChange(v === true)}
                  />
                  No code? Ask for a discount in your WhatsApp or email request
                </label>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCode(true)}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Tag className="h-4 w-4" /> Have a discount or referral code?
              </button>
            )}
          </section>
        </div>

        <div className="border-t bg-background/95 px-6 py-4 backdrop-blur">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold tracking-tight">
                {formatPrice(total)}
                {discountPercent > 0 && fullTotal > total && (
                  <span className="ml-2 text-base font-normal text-muted-foreground line-through">
                    {formatPrice(fullTotal)}
                  </span>
                )}
              </p>
            </div>
            {split && (
              <p className="text-right text-sm text-muted-foreground">
                or {formatPrice(split.deposit)} now,
                <br />
                the rest within {INSTALMENTS.balanceDueDays} days
              </p>
            )}
          </div>
          {isCustom && !valid && (
            <p className="mb-3 text-sm text-muted-foreground">
              Add courses worth at least {formatPrice(fee)} to continue.
            </p>
          )}
          <Button
            size="lg"
            className="h-12 w-full rounded-full text-base font-semibold"
            disabled={!valid}
            onClick={onContinue}
          >
            Continue to enrol
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
