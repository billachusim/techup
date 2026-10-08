import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { onboardStudent } from "@/lib/student-onboarding.functions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSupabase, mightHaveSession } from "@/integrations/supabase/lazy";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { SignupForm } from "./Auth/SignupForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ShieldCheck, Users, Trophy, AlertCircle, Code, Database, Shield, Cloud, Palette, TrendingUp, Sparkles, Smartphone, type LucideIcon } from "lucide-react";
import { CourseSelector } from "./Pricing/CourseSelector";
import { BenefitSelector } from "./Pricing/BenefitSelector";
import { LearningModeSelector } from "./Pricing/LearningModeSelector";
import { CheckoutDialog } from "./Pricing/CheckoutDialog";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  ALL_COURSES as allAvailableCourses,
  LEARNING_MODES,
  PLAN_PRICING,
  type Benefit,
  type Course,
  type LearningMode,
} from "../../supabase/functions/_shared/pricing.ts";

type PlanCategory = "beginner" | "development" | "data-ai" | "creative" | "security" | "custom";

interface DepartmentPlan {
  id: string;
  name: string;
  fancyName: string;
  icon: LucideIcon;
  category: PlanCategory;
  description: string;
  courses: Course[];
  learningModes: LearningMode[];
  benefits: Benefit[];
  isFree?: boolean;
  isCustom?: boolean;
  minimumAmount: number;
}

interface Selection {
  selectedCourses: string[];
  selectedBenefits: string[];
  learningMode: string;
}


const departmentPlans: DepartmentPlan[] = [
  {
    id: "bootcamp-starter",
    name: "Bootcamp Starter",
    fancyName: "Everyday AI & Digital Productivity",
    icon: Users,
    category: "beginner",
    description: "Start your tech journey with essential free courses",
    isFree: true,
    ...PLAN_PRICING["bootcamp-starter"],
  },
  {
    id: "developer-pro",
    name: "Developer Pro",
    fancyName: "AI for Full-Stack Web Development",
    icon: Code,
    category: "development",
    description: "Master full-stack web development from scratch",
    ...PLAN_PRICING["developer-pro"],
  },
  {
    id: "data-wizard",
    name: "Data Wizard",
    fancyName: "AI for Data Analytics & Business Intelligence",
    icon: Database,
    category: "data-ai",
    description: "Become a data science expert and unlock insights",
    ...PLAN_PRICING["data-wizard"],
  },
  {
    id: "ai-innovator",
    name: "AI Innovator",
    fancyName: "AI & Autonomous Agents Engineering",
    icon: Sparkles,
    category: "data-ai",
    description: "Lead the AI revolution with cutting-edge skills",
    ...PLAN_PRICING["ai-innovator"],
  },
  {
    id: "security-shield",
    name: "Security Shield",
    fancyName: "AI for Cybersecurity & Threat Intelligence",
    icon: Shield,
    category: "security",
    description: "Master cybersecurity and protect digital assets",
    ...PLAN_PRICING["security-shield"],
  },
  {
    id: "mobile-app-developer",
    name: "Mobile App Developer",
    fancyName: "AI for Mobile App Development",
    icon: Smartphone,
    category: "development",
    description: "Build powerful mobile apps for iOS and Android",
    ...PLAN_PRICING["mobile-app-developer"],
  },
  {
    id: "cloud-architect",
    name: "Cloud Architect",
    fancyName: "AI for Cloud & DevOps Engineering",
    icon: Cloud,
    category: "development",
    description: "Master cloud platforms and modern DevOps practices",
    ...PLAN_PRICING["cloud-architect"],
  },
  {
    id: "design-master",
    name: "Design Master",
    fancyName: "AI for UI/UX & Product Design",
    icon: Palette,
    category: "creative",
    description: "Create stunning user experiences and interfaces",
    ...PLAN_PRICING["design-master"],
  },
  {
    id: "digital-marketing-pro",
    name: "Digital Marketing Pro",
    fancyName: "AI for Digital Marketing & Growth",
    icon: TrendingUp,
    category: "creative",
    description: "Master digital marketing and growth strategies",
    ...PLAN_PRICING["digital-marketing-pro"],
  },
  {
    id: "custom-builder",
    name: "Custom Program",
    fancyName: "AI-Powered Custom Programme",
    icon: Trophy,
    category: "custom",
    description: "Create your own custom learning journey",
    isCustom: true,
    ...PLAN_PRICING["custom-builder"],
  },
];

const Pricing = () => {
  const [activeCategory, setActiveCategory] = useState<PlanCategory>("beginner");
  const [facultyIdDialogOpen, setFacultyIdDialogOpen] = useState(false);
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [facultyId, setFacultyId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [requestDiscount, setRequestDiscount] = useState(false);
  const [customCourseSearch, setCustomCourseSearch] = useState("");
  const [userHasPaidPlan, setUserHasPaidPlan] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<Tables<"enrollments"> | null>(null);
  const { toast } = useToast();
  const { formatPrice, symbol, convertPrice, isNigeria } = useCurrency();
  const runOnboarding = useServerFn(onboardStudent);

  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [totalPrices, setTotalPrices] = useState<Record<string, number>>({});

  // Check if user has paid plan and fetch enrollment data
  useEffect(() => {
    const checkUserPlan = async () => {
      // Signed-out visitors have no plan to check, so skip loading the client.
      if (!mightHaveSession()) return;
      const supabase = await getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("faculty_id")
          .eq("id", user.id)
          .single();

        if (profile?.faculty_id) {
          const { data: enrollments } = await supabase
            .from("enrollments")
            .select("*")
            .eq("faculty_id", profile.faculty_id)
            .order("created_at", { ascending: false });

          const hasPaidPlan = enrollments?.some(e => e.plan_name !== "Bootcamp Starter");
          setUserHasPaidPlan(hasPaidPlan || false);
          
          // Set latest enrollment
          if (enrollments && enrollments.length > 0) {
            setEnrollmentData(enrollments[0]);
          }
        }
      }
    };
    checkUserPlan();
  }, []);

  useEffect(() => {
    const initialSelections: Record<string, Selection> = {};
    departmentPlans.forEach((plan) => {
      if (plan.isFree) {
        initialSelections[plan.id] = {
          selectedCourses: plan.courses.map(c => c.id),
          selectedBenefits: plan.benefits.map(b => b.id),
          learningMode: plan.learningModes[0]?.id || "",
        };
      } else {
        initialSelections[plan.id] = {
          selectedCourses: [],
          selectedBenefits: [],
          learningMode: plan.learningModes[0]?.id || "",
        };
      }
    });
    setSelections(initialSelections);
  }, []);

  useEffect(() => {
    const newTotalPrices: Record<string, number> = {};
    
    Object.keys(selections).forEach((planId) => {
      const plan = departmentPlans.find((p) => p.id === planId);
      if (!plan) return;

      const selection = selections[planId];
      let total = 0;

      const courses = plan.isCustom 
        ? allAvailableCourses.filter(c => selection.selectedCourses.includes(c.id))
        : plan.courses;

      selection.selectedCourses.forEach((courseId) => {
        const course = courses.find((c) => c.id === courseId);
        if (course) total += course.price;
      });

      const mode = plan.learningModes.find((m) => m.id === selection.learningMode);
      if (mode) total += mode.price;

      selection.selectedBenefits.forEach((benefitId) => {
        const benefit = plan.benefits.find((b) => b.id === benefitId);
        if (benefit) total += benefit.price;
      });

      if (discountCode.toUpperCase() === "TECHUP50") {
        total = total * 0.5;
      } else if (discountCode.toUpperCase() === "TECHUP25") {
        total = total * 0.75;
      }

      newTotalPrices[planId] = Math.round(total);
    });

    setTotalPrices(newTotalPrices);
  }, [selections, discountCode]);

  const handleToggleCourse = (planId: string, courseId: string) => {
    const plan = departmentPlans.find(p => p.id === planId);
    if (plan?.isFree) return;
    
    setSelections((prev) => {
      const current = prev[planId] || { selectedCourses: [], selectedBenefits: [], learningMode: "" };
      const selectedCourses = current.selectedCourses.includes(courseId)
        ? current.selectedCourses.filter((id) => id !== courseId)
        : [...current.selectedCourses, courseId];
      return { ...prev, [planId]: { ...current, selectedCourses } };
    });
  };

  const handleToggleBenefit = (planId: string, benefitId: string) => {
    const plan = departmentPlans.find(p => p.id === planId);
    if (plan?.isFree) return;
    
    setSelections((prev) => {
      const current = prev[planId] || { selectedCourses: [], selectedBenefits: [], learningMode: "" };
      const selectedBenefits = current.selectedBenefits.includes(benefitId)
        ? current.selectedBenefits.filter((id) => id !== benefitId)
        : [...current.selectedBenefits, benefitId];
      return { ...prev, [planId]: { ...current, selectedBenefits } };
    });
  };

  const handleSelectLearningMode = (planId: string, modeId: string) => {
    setSelections((prev) => {
      const current = prev[planId] || { selectedCourses: [], selectedBenefits: [], learningMode: "" };
      return { ...prev, [planId]: { ...current, learningMode: modeId } };
    });
  };

  const handleSelectAll = (planId: string) => {
    const plan = departmentPlans.find(p => p.id === planId);
    if (!plan || plan.isFree) return;

    const courses = plan.isCustom ? allAvailableCourses : plan.courses;
    
    setSelections(prev => ({
      ...prev,
      [planId]: {
        selectedCourses: courses.map(c => c.id),
        selectedBenefits: plan.benefits.map(b => b.id),
        learningMode: prev[planId]?.learningMode || plan.learningModes[0]?.id
      }
    }));
  };

  const handleAddCustomCourse = (planId: string, courseId: string) => {
    setSelections(prev => {
      const current = prev[planId] || { selectedCourses: [], selectedBenefits: [], learningMode: "online-only" };
      if (current.selectedCourses.includes(courseId)) return prev;
      
      return {
        ...prev,
        [planId]: {
          ...current,
          selectedCourses: [...current.selectedCourses, courseId]
        }
      };
    });
  };

  const handleSubmitRequest = async (planId: string) => {
    const plan = departmentPlans.find(p => p.id === planId);
    
    // Prevent switching from paid to free
    if (plan?.isFree && userHasPaidPlan) {
      toast({
        title: "Action Not Allowed",
        description: "You already have a paid plan. Contact support via WhatsApp to make changes.",
        variant: "destructive",
      });
      return;
    }

    // Prevent paid users from switching to other paid plans
    if (!plan?.isFree && userHasPaidPlan) {
      toast({
        title: "Plan Change Restricted",
        description: "To change your paid plan, please contact us via WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    const total = totalPrices[planId] || 0;
    
    if (!plan?.isFree && total < (plan?.minimumAmount || 0)) {
      toast({
        title: "Minimum Amount Required",
        description: `Please select items totaling at least ${formatPrice(plan?.minimumAmount || 0)}`,
        variant: "destructive",
      });
      return;
    }

    setSelectedPlanId(planId);

    // If user is logged in, skip the faculty ID dialog
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("faculty_id")
        .eq("id", user.id)
        .single();

      if (profile?.faculty_id) {
        setFacultyId(profile.faculty_id);
        setCheckoutDialogOpen(true);
        return;
      }
    }

    // Fallback: show faculty ID dialog for unauthenticated users
    setFacultyIdDialogOpen(true);
  };

  const handleFacultyIdSubmit = async () => {
    if (!facultyId.trim()) {
      toast({
        title: "Faculty ID Required",
        description: "Please enter your faculty ID",
        variant: "destructive",
      });
      return;
    }

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .select("faculty_id")
      .eq("faculty_id", facultyId)
      .single();

    if (error || !data) {
      toast({
        title: "Faculty ID Not Found",
        description: "Please sign up first to get your faculty ID",
        variant: "destructive",
      });
      setFacultyIdDialogOpen(false);
      setSignupDialogOpen(true);
      return;
    }

    setFacultyIdDialogOpen(false);
    setCheckoutDialogOpen(true);
  };

  const handleCheckoutSubmit = async (method: 'email' | 'whatsapp' | 'card') => {
    setIsSubmitting(true);
    
    try {
      const plan = departmentPlans.find((p) => p.id === selectedPlanId);
      if (!plan) {
        setIsSubmitting(false);
        return;
      }

      const selection = selections[selectedPlanId];
      const total = totalPrices[selectedPlanId];

      // Get current user profile
      const supabase = await getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      const currentFacultyId = profile.faculty_id;
      
      // Get the selected learning mode
      const selectedMode = LEARNING_MODES.find(m => m.id === selection?.learningMode)?.name || 'online-only';
      
      // Generate new faculty ID with enrollment details
      const { data: newFacultyId, error: idError } = await supabase.rpc('generate_faculty_id', {
        dept_name: plan.name,
        learn_mode: selectedMode,
        cohort_mo: new Date().getMonth() + 1,
        cohort_yr: new Date().getFullYear()
      });

      if (idError || !newFacultyId) {
        console.error('Error generating new faculty ID:', idError);
        throw new Error('Failed to generate faculty ID');
      }

      // Update profile with new faculty ID and enrollment details
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          faculty_id: newFacultyId,
          department: plan.name,
          learning_mode: selectedMode,
          cohort_month: new Date().getMonth() + 1,
          cohort_year: new Date().getFullYear(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error('Failed to update profile');
      }

      // Record the Faculty ID itself via a secure function (direct writes are blocked)
      const { error: recordError } = await supabase.rpc('record_my_faculty_id', {
        // The generated types say string, but the SQL function treats null as "no previous ID"
        _old_id: (currentFacultyId ?? null) as string,
        _department: plan.name,
      });
      if (recordError) {
        console.error('Error recording faculty ID:', recordError);
        throw new Error('Failed to save Faculty ID');
      }

      if (currentFacultyId) {
        // Carry existing records over to the new Faculty ID
        await Promise.all([
          supabase.from("enrollments").update({ faculty_id: newFacultyId, learning_mode: selectedMode }).eq('faculty_id', currentFacultyId),
          supabase.from("course_enrollments").update({ faculty_id: newFacultyId }).eq('faculty_id', currentFacultyId),
          supabase.from("course_progress").update({ faculty_id: newFacultyId }).eq('faculty_id', currentFacultyId),
        ]);
      }

      // Create new enrollment with status based on payment method
      const enrollmentStatus = plan.isFree ? "active" : (method === 'card' ? "active" : "pending");
      await supabase.from("enrollments").insert({
        faculty_id: newFacultyId,
        plan_name: plan.name,
        status: enrollmentStatus,
        learning_mode: selectedMode,
      });

      // Slack class group + welcome email (best effort, never blocks enrolment)
      try {
        await runOnboarding();
      } catch (onboardErr) {
        console.warn('Student onboarding automation failed:', onboardErr);
      }



      const courses = plan.isCustom 
        ? allAvailableCourses.filter(c => selection.selectedCourses.includes(c.id))
        : plan.courses;

      const selectedCourseDetails = selection.selectedCourses.map((id) => {
        const course = courses.find((c) => c.id === id);
        return course ? { name: course.name, price: course.price } : null;
      }).filter(Boolean) as { name: string; price: number }[];

      const selectedBenefitDetails = selection.selectedBenefits.map((id) => {
        const benefit = plan.benefits.find((b) => b.id === id);
        return benefit ? { name: benefit.name, price: benefit.price, description: benefit.description } : null;
      }).filter(Boolean) as { name: string; price: number; description?: string }[];

      const learningModeDetail = plan.learningModes.find((m) => m.id === selection.learningMode);

      const discountInfo = requestDiscount 
        ? "\n*Requesting Discount Code*" 
        : (discountCode ? `\n*Discount Code Applied:* ${discountCode.toUpperCase()}` : "");

      // Handle card payment via Flutterwave
      if (method === 'card') {
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
          body: {
            planId: plan.id,
            planName: plan.fancyName,
            facultyId: newFacultyId,
            // The server looks up prices from these ids itself
            courseIds: selection.selectedCourses,
            benefitIds: selection.selectedBenefits,
            learningModeId: selection.learningMode || null,
            currencyCode: isNigeria ? 'NGN' : 'USD',
            discountCode: discountCode || '',
            successUrl: `${window.location.origin}/payment-success`,
            cancelUrl: `${window.location.origin}/#pricing`,
          },
        });

        const checkoutUrl = checkoutData?.url?.trim();

        if (checkoutError || !checkoutUrl) {
          throw new Error(checkoutData?.error || checkoutError?.message || 'Failed to create checkout session');
        }

        if (!/^https?:\/\//i.test(checkoutUrl)) {
          throw new Error('Invalid checkout link received. Please try again.');
        }

        setIsSubmitting(false);
        setCheckoutDialogOpen(false);
        window.location.assign(checkoutUrl);
        return;
      }

      // Build enriched message for WhatsApp/Email
      const message = `Hello Tech Faculty! 👋

My name is ${profile.name} and I am ready to make payment for the *${plan.fancyName}* plan.

Here are my enrollment details:

*Faculty ID:* ${newFacultyId}
*(Previous ID: ${currentFacultyId})*
*Plan:* ${plan.fancyName}
*Total:* ${formatPrice(total)}${discountInfo}

*Selected Courses:*
${selectedCourseDetails.length > 0 ? selectedCourseDetails.map(c => `✓ ${c.name} - ${formatPrice(c.price)}`).join('\n') : 'No courses selected'}

*Learning Mode:* ${learningModeDetail?.name} - ${learningModeDetail?.price === 0 ? 'Included' : formatPrice(learningModeDetail?.price || 0)}

*Additional Benefits:*
${selectedBenefitDetails.length > 0 ? selectedBenefitDetails.map(b => `✓ ${b.name} - ${formatPrice(b.price)}`).join('\n') : 'No benefits selected'}

Please share the payment details so I can complete my enrollment. Thank you!`;

      if (method === 'whatsapp') {
        const whatsappUrl = `https://wa.me/2348068597140?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        toast({
          title: "Enrollment Submitted!",
          description: `Your new Faculty ID is ${newFacultyId}. Complete the request on WhatsApp.`,
        });
      } else {
        const emailSubject = `Enrollment Request - ${newFacultyId} - ${plan.fancyName}`;
        const emailBody = message.replace(/\*/g, '').replace(/✓/g, '-');
        const mailtoUrl = `mailto:thetechfaculty@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoUrl;

        toast({
          title: "Enrollment Submitted!",
          description: `Your new Faculty ID is ${newFacultyId}. Complete the request via email.`,
        });
      }

      setIsSubmitting(false);
      setCheckoutDialogOpen(false);
      setFacultyId("");
      setSelectedPlanId("");
      
      // Reload to refresh user context with new faculty ID
      setTimeout(() => window.location.reload(), 2000);
      
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: (error instanceof Error && error.message) || "An error occurred during enrollment",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const filteredPlans = departmentPlans.filter((plan) => plan.category === activeCategory);

  const renderFreePlan = (plan: DepartmentPlan) => {
    const Icon = plan.icon;
    const isUserOnThisPlan = enrollmentData?.plan_name === plan.name || 
                             (enrollmentData?.plan_name === "Bootcamp Starter" && plan.name === "Free Bootcamp");
    
    return (
      <Card key={plan.id} className={`border-2 ${isUserOnThisPlan ? 'border-primary' : 'border-primary/30'} hover:border-primary/50 transition-colors`}>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Icon className="h-8 w-8 text-primary" />
            <div className="flex gap-2">
              {isUserOnThisPlan && (
                <Badge variant="default" className="bg-primary">Active</Badge>
              )}
              <Badge variant="secondary">Free</Badge>
            </div>
          </div>
          <CardTitle>{plan.fancyName}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="text-3xl font-bold text-primary mt-4">{formatPrice(0)}</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Included Courses:</h4>
            {plan.courses.map(course => (
              <div key={course.id} className="flex items-center gap-2 text-sm p-2 bg-primary/5 rounded">
                <div className="h-4 w-4 rounded-sm border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-foreground">{course.name}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Benefits:</h4>
            {plan.benefits.map(benefit => (
              <div key={benefit.id} className="flex items-center gap-2 text-sm p-2 bg-primary/5 rounded">
                <div className="h-4 w-4 rounded-sm border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-foreground">{benefit.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleSubmitRequest(plan.id)} 
            className="w-full"
            size="lg"
            disabled={userHasPaidPlan || isUserOnThisPlan}
          >
            {isUserOnThisPlan ? "Current Plan" : userHasPaidPlan ? "Already Have Paid Plan" : "Start Free Journey"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderCustomPlan = (plan: DepartmentPlan) => {
    const Icon = plan.icon;
    const selection = selections[plan.id] || { selectedCourses: [], selectedBenefits: [], learningMode: "online-only" };
    const total = totalPrices[plan.id] || 0;
    const meetsMinimum = total >= plan.minimumAmount;

    const filteredCourses = customCourseSearch
      ? allAvailableCourses.filter(c => 
          c.name.toLowerCase().includes(customCourseSearch.toLowerCase()) ||
          c.category?.toLowerCase().includes(customCourseSearch.toLowerCase())
        )
      : allAvailableCourses;

    const selectedCourses = allAvailableCourses.filter(c => selection.selectedCourses.includes(c.id));

    return (
      <Card key={plan.id} className="border-2 hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Icon className="h-8 w-8 text-primary" />
            <div className="text-right">
              <Badge variant={meetsMinimum ? "default" : "destructive"} className="text-lg px-3 py-1">
                {formatPrice(total)}
              </Badge>
              {!meetsMinimum && (
                <p className="text-xs text-destructive flex items-center gap-1 justify-end mt-1">
                  <AlertCircle className="h-3 w-3" />
                  Min: {formatPrice(plan.minimumAmount)}
                </p>
              )}
            </div>
          </div>
          <CardTitle>{plan.fancyName}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-foreground">Search & Add Courses</h4>
            </div>
            <Input
              placeholder="Search courses by name or category..."
              value={customCourseSearch}
              onChange={(e) => setCustomCourseSearch(e.target.value)}
            />
            <ScrollArea className="h-48 border rounded-lg p-2">
              {filteredCourses.map(course => {
                const isSelected = selection.selectedCourses.includes(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => !isSelected && handleAddCustomCourse(plan.id, course.id)}
                    className={`p-2 mb-1 rounded cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 cursor-not-allowed' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{course.name}</p>
                        <p className="text-xs text-muted-foreground">{course.category}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(course.price)}</span>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>

          {selectedCourses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-foreground">Selected Courses ({selectedCourses.length})</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll(plan.id)}
                >
                  Select All
                </Button>
              </div>
              {selectedCourses.map(course => (
                <div key={course.id} className="flex justify-between items-center text-sm p-2 bg-muted rounded">
                  <span>{course.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleCourse(plan.id, course.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          <LearningModeSelector
            modes={plan.learningModes}
            selectedMode={selection.learningMode}
            onSelectMode={(mode) => handleSelectLearningMode(plan.id, mode)}
          />

          {plan.benefits.length > 0 && (
            <BenefitSelector
              benefits={plan.benefits}
              selectedBenefits={selection.selectedBenefits}
              onToggleBenefit={(id) => handleToggleBenefit(plan.id, id)}
            />
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleSubmitRequest(plan.id)} 
            className="w-full"
            disabled={!meetsMinimum}
            size="lg"
          >
            Submit Custom Request
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderPaidPlan = (plan: DepartmentPlan) => {
    const Icon = plan.icon;
    const selection = selections[plan.id] || { selectedCourses: [], selectedBenefits: [], learningMode: "online-only" };
    const total = totalPrices[plan.id] || 0;
    const meetsMinimum = total >= plan.minimumAmount;
    const isUserOnThisPlan = enrollmentData?.plan_name === plan.name;

    return (
      <Card key={plan.id} className={`border-2 ${isUserOnThisPlan ? 'border-primary' : 'border-border'} hover:border-primary/50 transition-colors`}>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Icon className="h-8 w-8 text-primary" />
            <div className="text-right flex flex-col items-end gap-2">
              {isUserOnThisPlan && (
                <Badge variant="default" className="bg-primary">Active Plan</Badge>
              )}
              <Badge variant={meetsMinimum ? "default" : "destructive"} className="text-lg px-3 py-1">
                {formatPrice(total)}
              </Badge>
              {!meetsMinimum && (
                <p className="text-xs text-destructive flex items-center gap-1 justify-end mt-1">
                  <AlertCircle className="h-3 w-3" />
                  Min: {formatPrice(plan.minimumAmount)}
                </p>
              )}
            </div>
          </div>
          <CardTitle>{plan.fancyName}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSelectAll(plan.id)}
            className="w-full"
          >
            Select All
          </Button>

          <CourseSelector
            courses={plan.courses}
            selectedCourses={selection.selectedCourses}
            onToggleCourse={(courseId) => handleToggleCourse(plan.id, courseId)}
          />

          <LearningModeSelector
            modes={plan.learningModes}
            selectedMode={selection.learningMode}
            onSelectMode={(modeId) => handleSelectLearningMode(plan.id, modeId)}
          />
          
          <BenefitSelector
            benefits={plan.benefits}
            selectedBenefits={selection.selectedBenefits}
            onToggleBenefit={(benefitId) => handleToggleBenefit(plan.id, benefitId)}
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => handleSubmitRequest(plan.id)}
            disabled={!meetsMinimum || isUserOnThisPlan}
            className="w-full"
            size="lg"
          >
            {isUserOnThisPlan ? "Current Plan" : "Submit Request"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold">Choose Your Path</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build your custom learning package. Select courses and benefits that match your goals.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline" className="text-sm">Flexible Pricing by Department</Badge>
            <Badge variant="default" className="text-sm">Dynamic Pricing Active</Badge>
          </div>
        </div>

        <div className="mb-8 space-y-4 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter discount code (if you have one)"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            {discountCode && (
              <Badge variant="secondary">
                {discountCode.toUpperCase() === "TECHUP50" ? "50% OFF" : 
                 discountCode.toUpperCase() === "TECHUP25" ? "25% OFF" : "Invalid"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="request-discount" 
              checked={requestDiscount}
              onCheckedChange={(checked) => setRequestDiscount(checked as boolean)}
            />
            <Label htmlFor="request-discount" className="text-sm text-muted-foreground cursor-pointer">
              Don't have a discount code? Request one in your enrollment message
            </Label>
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as PlanCategory)} className="mb-8">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-8">
            <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-6 md:max-w-4xl md:mx-auto gap-1">
              <TabsTrigger value="beginner" className="whitespace-nowrap px-4">Beginner</TabsTrigger>
              <TabsTrigger value="development" className="whitespace-nowrap px-4">Development</TabsTrigger>
              <TabsTrigger value="data-ai" className="whitespace-nowrap px-4">Data & AI</TabsTrigger>
              <TabsTrigger value="creative" className="whitespace-nowrap px-4">Creative</TabsTrigger>
              <TabsTrigger value="security" className="whitespace-nowrap px-4">Security</TabsTrigger>
              <TabsTrigger value="custom" className="whitespace-nowrap px-4">Custom</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredPlans.map((plan) => {
            if (plan.isFree) return renderFreePlan(plan);
            if (plan.isCustom) return renderCustomPlan(plan);
            return renderPaidPlan(plan);
          })}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Flexible Payment Plans</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Expert Instructors</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Industry Certifications</span>
          </div>
        </div>
      </div>

      <Dialog open={facultyIdDialogOpen} onOpenChange={setFacultyIdDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Faculty ID</DialogTitle>
            <DialogDescription>Please enter your faculty ID to continue</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="faculty-id">Faculty ID</Label>
              <Input
                id="faculty-id"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                placeholder="TF-XXXX-XXXX"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setFacultyIdDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleFacultyIdSubmit} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={signupDialogOpen} onOpenChange={setSignupDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
            <DialogDescription>Sign up to get your faculty ID and enroll</DialogDescription>
          </DialogHeader>
          <SignupForm onSuccess={() => setSignupDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <CheckoutDialog
        open={checkoutDialogOpen}
        onOpenChange={setCheckoutDialogOpen}
        onSubmit={handleCheckoutSubmit}
        totalAmount={totalPrices[selectedPlanId] || 0}
        isLoading={isSubmitting}
      />
    </section>
  );
};

export default Pricing;
