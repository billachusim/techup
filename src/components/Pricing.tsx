import { Check, GraduationCap, Code, BarChart, Shield, Brain, Cloud, Palette, Megaphone, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignupForm } from "@/components/Auth/SignupForm";
import { useUser } from "@/contexts/UserContext";
import { MessageCircle } from "lucide-react";

type PlanCategory = "all" | "beginner" | "development" | "data-ai" | "creative" | "security";

const pricingPlans = [
  {
    name: "Bootcamp Starter",
    icon: GraduationCap,
    price: "Free",
    description: "Perfect for beginners exploring tech careers",
    category: "beginner" as PlanCategory,
    gradient: "var(--gradient-beginner)",
    colorClass: "text-gradient",
    features: [
      "Intro to Programming",
      "Intro to AI & ChatGPT",
      "Git & GitHub Fundamentals",
      "Tech Career Guidance",
      "Community Access",
      "Self-Paced Learning",
      "Basic Digital Literacy",
    ],
    cta: "Start Free",
    popular: false,
    badge: "Best for Beginners",
    isFree: true,
  },
  {
    name: "Developer Pro",
    icon: Code,
    price: "$299",
    period: "/3 months",
    description: "Comprehensive web development mastery",
    category: "development" as PlanCategory,
    gradient: "var(--gradient-development)",
    colorClass: "text-gradient-blue",
    features: [
      "Everything in Bootcamp Plan plus:",
      "Full-Stack Web Development",
      "React & Node.js",
      "Database Management",
      "REST APIs & GraphQL",
      "Portfolio Projects",
      "Work & Earn Program",
      "Job Placement Support",
      "Industry Certifications",
    ],
    cta: "Enrol Now",
    popular: true,
    badge: "Most Popular",
    isFree: false,
  },
  {
    name: "Data Wizard",
    icon: BarChart,
    price: "$349",
    period: "/3 months",
    description: "Master data science and analytics",
    category: "data-ai" as PlanCategory,
    gradient: "var(--gradient-data)",
    colorClass: "text-gradient-purple",
    features: [
      "Everything in Bootcamp Plan plus:",
      "Python & SQL Mastery",
      "Data Visualization",
      "Statistical Analysis",
      "Machine Learning Basics",
      "Real-World Projects",
      "Work & Earn Program",
      "Job Placement Support",
      "Certifications Included",
    ],
    cta: "Start Learning",
    popular: false,
    badge: "High Demand",
    isFree: false,
  },
  {
    name: "Security Shield",
    icon: Shield,
    price: "$399",
    period: "/4 months",
    description: "Become a cybersecurity expert",
    category: "security" as PlanCategory,
    gradient: "var(--gradient-security)",
    colorClass: "text-gradient-orange",
    features: [
      "Everything in Bootcamp Plan plus:",
      "Network Security",
      "Ethical Hacking",
      "SOC Operations",
      "Incident Response",
      "CompTIA & CEH Prep",
      "Work & Earn Program",
      "Job Placement Support",
      "Hands-On Labs",
    ],
    cta: "Tech Up",
    popular: false,
    badge: "Critical Skills",
    isFree: false,
  },
  {
    name: "AI Innovator",
    icon: Brain,
    price: "$449",
    period: "/4 months",
    description: "Build cutting-edge AI solutions",
    category: "data-ai" as PlanCategory,
    gradient: "var(--gradient-data)",
    colorClass: "text-gradient-purple",
    features: [
      "Everything in Bootcamp Plan plus:",
      "Deep Learning & Neural Networks",
      "TensorFlow & PyTorch",
      "NLP & Computer Vision",
      "AI Model Deployment",
      "Real AI Projects",
      "Work & Earn Program",
      "Job Placement Support",
      "Research Papers Access",
    ],
    cta: "Start Now",
    popular: false,
    badge: "Future Tech",
    isFree: false,
  },
  {
    name: "Cloud Architect",
    icon: Cloud,
    price: "$379",
    period: "/3 months",
    description: "Master cloud platforms and DevOps",
    category: "development" as PlanCategory,
    gradient: "var(--gradient-development)",
    colorClass: "text-gradient-blue",
    features: [
      "Everything in Bootcamp Plan plus:",
      "AWS, Azure & GCP",
      "Cloud Architecture",
      "DevOps & CI/CD",
      "Kubernetes & Docker",
      "Cloud Certifications",
      "Work & Earn Program",
      "Job Placement Support",
      "Hands-On Projects",
    ],
    cta: "Register",
    popular: false,
    badge: "Enterprise Ready",
    isFree: false,
  },
  {
    name: "Design Master",
    icon: Palette,
    price: "$279",
    period: "/3 months",
    description: "Master visual design and user experience",
    category: "creative" as PlanCategory,
    gradient: "var(--gradient-creative)",
    colorClass: "text-gradient-pink",
    features: [
      "Everything in Bootcamp Plan plus:",
      "UI/UX Design Principles",
      "Figma & Adobe Suite",
      "Product Design",
      "Design Systems",
      "Portfolio Development",
      "Work & Earn Program",
      "Job Placement Support",
      "Real Client Projects",
    ],
    cta: "Start Designing",
    popular: false,
    badge: "Creative Track",
    isFree: false,
  },
  {
    name: "Digital Marketing Pro",
    icon: Megaphone,
    price: "$259",
    period: "/3 months",
    description: "Master digital marketing and content creation",
    category: "creative" as PlanCategory,
    gradient: "var(--gradient-creative)",
    colorClass: "text-gradient-pink",
    features: [
      "Everything in Bootcamp Plan plus:",
      "Social Media Strategy",
      "Content Marketing",
      "SEO & SEM Mastery",
      "Video & Photo Editing",
      "Analytics & Growth",
      "Work & Earn Program",
      "Job Placement Support",
      "Certification Prep",
    ],
    cta: "Go Digital",
    popular: false,
    badge: "Business Growth",
    isFree: false,
  },
];

const courses = [
  "Full-Stack Web Development",
  "Data Science & Analytics",
  "Cybersecurity",
  "AI & Machine Learning",
  "Cloud Architecture & DevOps",
  "Mobile App Development",
];

const hearAboutUs = [
  "Social Media",
  "Friend/Colleague",
  "Google Search",
  "University/School",
  "Tech Event",
  "Other",
];

const Pricing = () => {
  const [couponCodes, setCouponCodes] = useState<Record<string, string>>({});
  const [showFacultyIdDialog, setShowFacultyIdDialog] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [facultyId, setFacultyId] = useState("");
  const [activeCategory, setActiveCategory] = useState<PlanCategory>("beginner");
  const [currentEnrollment, setCurrentEnrollment] = useState<any>(null);
  const { toast } = useToast();
  const { isLoggedIn, userData } = useUser();

  const filteredPlans = activeCategory === "all" 
    ? pricingPlans 
    : pricingPlans.filter(plan => plan.category === activeCategory);

  // Fetch current enrollment when user is logged in
  useEffect(() => {
    const fetchCurrentEnrollment = async () => {
      if (isLoggedIn && userData?.faculty_id) {
        const { data, error } = await supabase
          .from('enrollments')
          .select('*')
          .eq('faculty_id', userData.faculty_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setCurrentEnrollment(data);
        }
      }
    };

    fetchCurrentEnrollment();
  }, [isLoggedIn, userData]);

  const handleCouponChange = (planName: string, value: string) => {
    setCouponCodes({ ...couponCodes, [planName]: value });
  };

  const generateFacultyId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TF-${timestamp}-${random}`;
  };

  const handlePlanClick = (planName: string) => {
    const clickedPlan = pricingPlans.find(p => p.name === planName);
    
    // Check if user is logged in and on a paid plan
    if (isLoggedIn && userData?.faculty_id && currentEnrollment) {
      const currentPlan = pricingPlans.find(p => p.name === currentEnrollment.plan_name);
      
      // If current plan is paid and trying to switch to another paid plan (not free)
      if (currentPlan && !currentPlan.isFree && clickedPlan && !clickedPlan.isFree) {
        // Send to WhatsApp for plan change request
        const message = `Hi! I'm currently on *${currentEnrollment.plan_name}* and would like to switch to *${planName}*. My Faculty ID is: ${userData.faculty_id}. Please help me with the plan change process.`;
        const whatsappUrl = `https://wa.me/2348068597140?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        
        toast({
          title: "Plan Change Request Sent",
          description: "An admin will contact you to process your plan change after payment verification.",
        });
        return;
      }
    }
    
    // Normal flow for free plan switches or new enrollments
    setSelectedPlan(planName);
    setShowFacultyIdDialog(true);
  };

  const handleFacultyIdSubmit = async () => {
    if (!facultyId.trim()) {
      toast({
        title: "Faculty ID Required",
        description: "Please enter your Faculty ID to continue.",
        variant: "destructive",
      });
      return;
    }

    if (facultyId.trim().length < 5) {
      toast({
        title: "Invalid Faculty ID",
        description: "Please enter a valid Faculty ID.",
        variant: "destructive",
      });
      return;
    }

    // Verify Faculty ID exists in database
    const { data: facultyData, error } = await supabase
      .from('faculty_ids')
      .select('*')
      .eq('faculty_id', facultyId.trim())
      .maybeSingle();

    if (error) {
      console.error('Error verifying Faculty ID:', error);
      toast({
        title: "Verification Error",
        description: "Unable to verify Faculty ID. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!facultyData) {
      toast({
        title: "Faculty ID Not Found",
        description: "This Faculty ID doesn't exist. Please sign up to get one.",
        variant: "destructive",
      });
      return;
    }

    const plan = pricingPlans.find((p) => p.name === selectedPlan);
    
    // Save enrollment to database
    const { error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        faculty_id: facultyId.trim(),
        plan_name: selectedPlan,
        coupon_code: couponCodes[selectedPlan] || null,
        status: 'pending'
      });

    if (enrollmentError) {
      console.error('Error saving enrollment:', enrollmentError);
    }

    const message = plan?.isFree
      ? `Hi! I'm registering for the *${selectedPlan}* (Free Bootcamp). My Faculty ID is: ${facultyId.trim()}`
      : `Hi! I'm ready to pay for *${selectedPlan}*. My Faculty ID is: ${facultyId.trim()}`;

    const whatsappUrl = `https://wa.me/2348068597140?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    setShowFacultyIdDialog(false);
    setFacultyId("");
    
    toast({
      title: "Enrollment Submitted!",
      description: `Welcome back, ${facultyData.name}! Your enrollment for ${selectedPlan} has been recorded.`,
    });
  };

  const handleSignUpSuccess = async (facultyId: string) => {
    // Save enrollment to database
    const { error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        faculty_id: facultyId,
        plan_name: selectedPlan,
        coupon_code: couponCodes[selectedPlan] || null,
        status: 'pending'
      });

    if (enrollmentError) {
      console.error('Error saving enrollment:', enrollmentError);
    }

    setShowSignUpForm(false);
    setShowFacultyIdDialog(false);
    
    toast({
      title: "Registration Successful!",
      description: `You're enrolled in ${selectedPlan}. Your Faculty ID has been saved.`,
    });
  };

  const renderPlanCard = (plan: typeof pricingPlans[0], idx: number) => {
    const Icon = plan.icon;
    const isCurrentPlan = currentEnrollment?.plan_name === plan.name;
    const currentPlanData = currentEnrollment ? pricingPlans.find(p => p.name === currentEnrollment.plan_name) : null;
    const isPaidToAnotherPaid = isLoggedIn && currentPlanData && !currentPlanData.isFree && !plan.isFree && !isCurrentPlan;
    
    return (
      <Card
        key={idx}
        className={`relative bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${
          plan.popular ? "border-primary shadow-lg" : ""
        } ${isCurrentPlan ? "border-primary/70 shadow-lg" : ""}`}
      >
        {isCurrentPlan && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <Badge className="bg-primary text-background border-none px-4 py-1 shadow-lg">
              Your Current Plan
            </Badge>
          </div>
        )}
        {!isCurrentPlan && plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <Badge className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background border-none px-4 py-1 shadow-lg animate-pulse">
              <Star className="w-3 h-3 mr-1 inline" />
              {plan.badge}
            </Badge>
          </div>
        )}
        {!isCurrentPlan && !plan.popular && plan.badge && (
          <Badge 
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 border-border bg-background text-foreground"
            variant="outline"
          >
            {plan.badge}
          </Badge>
        )}

        <CardHeader className="text-center pb-8 pt-8">
          <div 
            className="mx-auto p-4 rounded-xl w-fit mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{ background: plan.gradient }}
          >
            <Icon size={36} className="text-background" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
            {plan.description}
          </p>
          <div className={`text-4xl font-bold ${plan.colorClass}`}>
            {plan.price}
            {plan.period && (
              <span className="text-lg text-muted-foreground font-normal">
                {plan.period}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-6">
          {plan.features.map((feature, fIdx) => (
            <div key={fIdx} className="flex items-start gap-2">
              <div 
                className="p-0.5 rounded-full mt-0.5"
                style={{ background: plan.gradient }}
              >
                <Check size={14} className="text-background" />
              </div>
              <span className={`text-sm ${fIdx === 0 && !plan.isFree ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {feature}
              </span>
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex-col gap-3">
          {!plan.isFree && (
            <div className="w-full">
              <Input
                placeholder="Have a coupon? Enter here"
                value={couponCodes[plan.name] || ""}
                onChange={(e) => handleCouponChange(plan.name, e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Apply coupon for 50% off
              </p>
            </div>
          )}
          <Button
            className="w-full group/btn"
            size="lg"
            onClick={() => handlePlanClick(plan.name)}
            style={{ 
              background: plan.popular && !isPaidToAnotherPaid ? plan.gradient : undefined,
            }}
            variant={plan.popular && !isPaidToAnotherPaid ? "default" : "outline"}
            disabled={isCurrentPlan}
          >
            {isCurrentPlan ? "Current Plan" : isPaidToAnotherPaid ? (
              <>
                Request Change
                <MessageCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                {plan.cta}
                <TrendingUp className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="outline">
            100% ROI Guarantee on Paid Plans
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible packages designed for every career goal. Start free or accelerate your journey with premium tracks.
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as PlanCategory)} className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 md:grid-cols-6 mb-12 h-auto p-1">
            <TabsTrigger value="all" className="text-xs md:text-sm">
              All Plans
            </TabsTrigger>
            <TabsTrigger value="beginner" className="text-xs md:text-sm">
              Beginner
            </TabsTrigger>
            <TabsTrigger value="development" className="text-xs md:text-sm">
              Development
            </TabsTrigger>
            <TabsTrigger value="data-ai" className="text-xs md:text-sm">
              Data & AI
            </TabsTrigger>
            <TabsTrigger value="creative" className="text-xs md:text-sm">
              Creative
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs md:text-sm">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {filteredPlans.map((plan, idx) => renderPlanCard(plan, idx))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>500+ Students Enrolled</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>85% Job Placement Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Money-Back Guarantee</span>
          </div>
        </div>
      </div>

      {/* Faculty ID Dialog */}
      <Dialog open={showFacultyIdDialog} onOpenChange={setShowFacultyIdDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Your Faculty ID</DialogTitle>
            <DialogDescription>
              Please enter your Faculty ID to proceed with {selectedPlan}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="facultyIdInput">Faculty ID</Label>
              <Input
                id="facultyIdInput"
                placeholder="e.g., TF-ABC123XYZ"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value.toUpperCase())}
                maxLength={50}
              />
            </div>

            <Button
              onClick={handleFacultyIdSubmit}
              className="w-full bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90"
            >
              Submit
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Don't have a Faculty ID?
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setShowFacultyIdDialog(false);
                setShowSignUpForm(true);
              }}
              className="w-full"
            >
              Sign Up Here
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Form Dialog */}
      <Dialog open={showSignUpForm} onOpenChange={setShowSignUpForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
            <DialogDescription>
              Sign up to get your Faculty ID and enroll in {selectedPlan}.
            </DialogDescription>
          </DialogHeader>
          <SignupForm onSuccess={handleSignUpSuccess} />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Pricing;
