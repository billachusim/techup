import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignupForm } from "./Auth/SignupForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ShieldCheck, Users, Trophy, AlertCircle } from "lucide-react";
import { CourseSelector } from "./Pricing/CourseSelector";
import { BenefitSelector } from "./Pricing/BenefitSelector";
import { LearningModeSelector } from "./Pricing/LearningModeSelector";
import { CheckoutDialog } from "./Pricing/CheckoutDialog";

type PlanCategory = "beginner" | "development" | "data-ai" | "creative" | "security";

interface Course {
  id: string;
  name: string;
  price: number;
}

interface Benefit {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface LearningMode {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface DepartmentPlan {
  id: string;
  name: string;
  fancyName: string;
  icon: any;
  category: PlanCategory;
  description: string;
  courses: Course[];
  learningModes: LearningMode[];
  benefits: Benefit[];
  isFree?: boolean;
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
    fancyName: "Free Foundation",
    icon: Users,
    category: "beginner",
    description: "Start your tech journey with essential free courses",
    isFree: true,
    courses: [
      { id: "intro-programming", name: "Intro to Programming", price: 0 },
      { id: "intro-ai-chatgpt", name: "Intro to AI & ChatGPT", price: 0 },
      { id: "git-github", name: "Git & GitHub Basics", price: 0 },
      { id: "tech-career", name: "Tech Career Guidance", price: 0 },
    ],
    learningModes: [
      { id: "online-only", name: "Online Only", price: 0, description: "Self-paced learning" }
    ],
    benefits: [
      { id: "community", name: "Community Access", price: 0 },
      { id: "self-paced", name: "Self-Paced Learning", price: 0 },
    ],
  },
  {
    id: "developer-pro",
    name: "Developer Pro",
    fancyName: "Web Development",
    icon: Trophy,
    category: "development",
    description: "Master full-stack web development",
    courses: [
      { id: "html-css", name: "HTML/CSS Fundamentals", price: 5000 },
      { id: "javascript", name: "JavaScript Mastery", price: 8000 },
      { id: "react", name: "React Development", price: 12000 },
      { id: "nodejs", name: "Node.js & Backend", price: 12000 },
      { id: "database", name: "Database Management", price: 8000 },
      { id: "fullstack-projects", name: "Full-Stack Projects", price: 10000 },
    ],
    learningModes: [
      { id: "online-only", name: "Online Only", price: 0, description: "Self-paced learning with recorded lectures" },
      { id: "hybrid", name: "Hybrid Mode", price: 8000, description: "Online + Monthly physical meetups" },
      { id: "physical", name: "Physical Classes", price: 15000, description: "Weekly on-site classes" },
    ],
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 10000 },
      { id: "internship", name: "Internship Access", price: 8000 },
      { id: "mentor-network", name: "Mentor Network Access", price: 12000 },
      { id: "certification-prep", name: "Industry Certification Prep", price: 15000 },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0 },
    ],
  },
  {
    id: "data-wizard",
    name: "Data Wizard",
    fancyName: "Data Science",
    icon: ShieldCheck,
    category: "data-ai",
    description: "Become a data science expert",
    courses: [
      { id: "python", name: "Python Programming", price: 7000 },
      { id: "sql", name: "SQL & Databases", price: 6000 },
      { id: "data-viz", name: "Data Visualization", price: 8000 },
      { id: "statistics", name: "Statistical Analysis", price: 9000 },
      { id: "ml-basics", name: "Machine Learning Basics", price: 15000 },
      { id: "data-projects", name: "Real-world Projects", price: 10000 },
    ],
    learningModes: [
      { id: "online-only", name: "Online Only", price: 0, description: "Self-paced learning with recorded lectures" },
      { id: "hybrid", name: "Hybrid Mode", price: 8000, description: "Online + Monthly physical meetups" },
      { id: "physical", name: "Physical Classes", price: 15000, description: "Weekly on-site classes" },
    ],
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 10000 },
      { id: "internship", name: "Internship Access", price: 8000 },
      { id: "mentor-network", name: "Mentor Network Access", price: 12000 },
      { id: "one-on-one", name: "One-on-One Mentorship (1hr/week)", price: 20000 },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0 },
    ],
  },
  {
    id: "security-shield",
    name: "Security Shield",
    fancyName: "Cybersecurity",
    icon: ShieldCheck,
    category: "security",
    description: "Master cybersecurity and ethical hacking",
    courses: [
      { id: "network-security", name: "Network Security", price: 10000 },
      { id: "ethical-hacking", name: "Ethical Hacking", price: 15000 },
      { id: "soc-ops", name: "SOC Operations", price: 12000 },
      { id: "incident-response", name: "Incident Response", price: 8000 },
      { id: "comptia-prep", name: "CompTIA Prep", price: 10000 },
      { id: "ceh-prep", name: "CEH Prep", price: 12000 },
    ],
    learningModes: [
      { id: "online-only", name: "Online Only", price: 0, description: "Self-paced learning with recorded lectures" },
      { id: "hybrid", name: "Hybrid Mode", price: 8000, description: "Online + Monthly physical meetups" },
      { id: "physical", name: "Physical Classes", price: 15000, description: "Weekly on-site classes" },
    ],
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 10000 },
      { id: "internship", name: "Internship Access", price: 8000 },
      { id: "mentor-network", name: "Mentor Network Access", price: 12000 },
      { id: "certification-prep", name: "Industry Certification Prep", price: 15000 },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0 },
    ],
  },
  {
    id: "ai-innovator",
    name: "AI Innovator",
    fancyName: "AI & Machine Learning",
    icon: Trophy,
    category: "data-ai",
    description: "Lead the AI revolution",
    courses: [
      { id: "deep-learning", name: "Deep Learning", price: 18000 },
      { id: "neural-networks", name: "Neural Networks", price: 15000 },
      { id: "tensorflow-pytorch", name: "TensorFlow/PyTorch", price: 12000 },
      { id: "nlp", name: "NLP Fundamentals", price: 14000 },
      { id: "computer-vision", name: "Computer Vision", price: 14000 },
      { id: "ai-deployment", name: "AI Deployment", price: 10000 },
    ],
    learningModes: [
      { id: "online-only", name: "Online Only", price: 0, description: "Self-paced learning with recorded lectures" },
      { id: "hybrid", name: "Hybrid Mode", price: 8000, description: "Online + Monthly physical meetups" },
      { id: "physical", name: "Physical Classes", price: 15000, description: "Weekly on-site classes" },
    ],
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 10000 },
      { id: "internship", name: "Internship Access", price: 8000 },
      { id: "mentor-network", name: "Mentor Network Access", price: 12000 },
      { id: "one-on-one", name: "One-on-One Mentorship (1hr/week)", price: 20000 },
      { id: "vip-classes", name: "VIP Classes at Chosen Location", price: 50000 },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0 },
    ],
  },
  {
    id: "design-master",
    name: "Design Master",
    fancyName: "UI/UX Design",
    icon: Trophy,
    category: "creative",
    description: "Create stunning user experiences",
    courses: [
      { id: "design-principles", name: "Design Principles", price: 6000 },
      { id: "figma", name: "Figma Mastery", price: 8000 },
      { id: "adobe-suite", name: "Adobe Suite", price: 10000 },
      { id: "product-design", name: "Product Design", price: 12000 },
      { id: "design-systems", name: "Design Systems", price: 9000 },
      { id: "portfolio-projects", name: "Portfolio Projects", price: 7000 },
    ],
    learningModes: [
      { id: "online-only", name: "Online Only", price: 0, description: "Self-paced learning with recorded lectures" },
      { id: "hybrid", name: "Hybrid Mode", price: 8000, description: "Online + Monthly physical meetups" },
      { id: "physical", name: "Physical Classes", price: 15000, description: "Weekly on-site classes" },
    ],
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 10000 },
      { id: "internship", name: "Internship Access", price: 8000 },
      { id: "mentor-network", name: "Mentor Network Access", price: 12000 },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0 },
    ],
  },
  {
    id: "digital-marketing-pro",
    name: "Digital Marketing Pro",
    fancyName: "Digital Marketing",
    icon: Trophy,
    category: "creative",
    description: "Master digital marketing",
    courses: [
      { id: "social-media", name: "Social Media Strategy", price: 7000 },
      { id: "content-marketing", name: "Content Marketing", price: 8000 },
      { id: "seo-sem", name: "SEO/SEM", price: 10000 },
      { id: "video-editing", name: "Video Editing", price: 9000 },
      { id: "photo-editing", name: "Photo Editing", price: 6000 },
      { id: "analytics", name: "Analytics & Growth", price: 8000 },
    ],
    learningModes: [
      { id: "online-only", name: "Online Only", price: 0, description: "Self-paced learning with recorded lectures" },
      { id: "hybrid", name: "Hybrid Mode", price: 8000, description: "Online + Monthly physical meetups" },
      { id: "physical", name: "Physical Classes", price: 15000, description: "Weekly on-site classes" },
    ],
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 10000 },
      { id: "internship", name: "Internship Access", price: 8000 },
      { id: "mentor-network", name: "Mentor Network Access", price: 12000 },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0 },
    ],
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
  const { toast } = useToast();

  // State for selections per department
  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [totalPrices, setTotalPrices] = useState<Record<string, number>>({});

  const MINIMUM_AMOUNT = 50000;

  useEffect(() => {
    // Initialize selections for all departments
    const initialSelections: Record<string, Selection> = {};
    departmentPlans.forEach((plan) => {
      initialSelections[plan.id] = {
        selectedCourses: [],
        selectedBenefits: [],
        learningMode: plan.learningModes[0]?.id || "",
      };
    });
    setSelections(initialSelections);
  }, []);

  useEffect(() => {
    // Calculate total prices for each department
    const newTotalPrices: Record<string, number> = {};
    
    Object.keys(selections).forEach((planId) => {
      const plan = departmentPlans.find((p) => p.id === planId);
      if (!plan) return;

      const selection = selections[planId];
      let total = 0;

      // Add course prices
      selection.selectedCourses.forEach((courseId) => {
        const course = plan.courses.find((c) => c.id === courseId);
        if (course) total += course.price;
      });

      // Add learning mode price
      const mode = plan.learningModes.find((m) => m.id === selection.learningMode);
      if (mode) total += mode.price;

      // Add benefit prices
      selection.selectedBenefits.forEach((benefitId) => {
        const benefit = plan.benefits.find((b) => b.id === benefitId);
        if (benefit) total += benefit.price;
      });

      newTotalPrices[planId] = total;
    });

    setTotalPrices(newTotalPrices);
  }, [selections]);

  const handleToggleCourse = (planId: string, courseId: string) => {
    setSelections((prev) => {
      const current = prev[planId] || { selectedCourses: [], selectedBenefits: [], learningMode: "" };
      const selectedCourses = current.selectedCourses.includes(courseId)
        ? current.selectedCourses.filter((id) => id !== courseId)
        : [...current.selectedCourses, courseId];
      return { ...prev, [planId]: { ...current, selectedCourses } };
    });
  };

  const handleToggleBenefit = (planId: string, benefitId: string) => {
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

  const handleStartFree = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setSignupDialogOpen(true);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("faculty_id")
      .eq("id", user.id)
      .single();

    if (!profile?.faculty_id) {
      toast({
        title: "Faculty ID Required",
        description: "Please complete your profile with a faculty ID",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.from("enrollments").insert({
        faculty_id: profile.faculty_id,
        plan_name: "Bootcamp Starter",
        status: "active",
      });

      toast({
        title: "Enrolled Successfully!",
        description: "Welcome to Tech Faculty! Check your email for next steps.",
      });
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSubmitRequest = (planId: string) => {
    const total = totalPrices[planId] || 0;
    
    if (total < MINIMUM_AMOUNT) {
      toast({
        title: "Minimum Amount Required",
        description: `Please select courses totaling at least ₦${MINIMUM_AMOUNT.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setSelectedPlanId(planId);
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

  const handleCheckoutSubmit = async (method: 'email' | 'whatsapp') => {
    setIsSubmitting(true);
    
    const plan = departmentPlans.find((p) => p.id === selectedPlanId);
    if (!plan) return;

    const selection = selections[selectedPlanId];
    const total = totalPrices[selectedPlanId];

    const selectedCourseDetails = selection.selectedCourses.map((id) => {
      const course = plan.courses.find((c) => c.id === id);
      return course ? `${course.name} - ₦${course.price.toLocaleString()}` : '';
    }).filter(Boolean);

    const selectedBenefitDetails = selection.selectedBenefits.map((id) => {
      const benefit = plan.benefits.find((b) => b.id === id);
      return benefit ? `${benefit.name} - ₦${benefit.price.toLocaleString()}` : '';
    }).filter(Boolean);

    const learningModeDetail = plan.learningModes.find((m) => m.id === selection.learningMode);

    const message = `Hi Tech Faculty NG Team! 👋

I'm ready to enroll in *${plan.fancyName}*

*Faculty ID:* ${facultyId}
*Total Amount:* ₦${total.toLocaleString()}

*Selected Courses:*
${selectedCourseDetails.map(c => `✓ ${c}`).join('\n')}

*Learning Mode:* ${learningModeDetail?.name} - ₦${learningModeDetail?.price.toLocaleString()}

*Additional Benefits:*
${selectedBenefitDetails.map(b => `✓ ${b}`).join('\n')}

*Payment Status:* Pending Payment

Please process my enrollment!`;

    if (method === 'whatsapp') {
      const whatsappUrl = `https://wa.me/2348068597140?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Request Sent!",
        description: "Complete your enrollment request on WhatsApp",
      });
    } else {
      try {
        const { error } = await supabase.functions.invoke('send-enrollment-request', {
          body: {
            facultyId,
            planName: plan.fancyName,
            totalAmount: total,
            selectedCourses: selectedCourseDetails,
            learningMode: `${learningModeDetail?.name} - ₦${learningModeDetail?.price.toLocaleString()}`,
            selectedBenefits: selectedBenefitDetails,
          },
        });

        if (error) throw error;

        toast({
          title: "Request Sent!",
          description: "Check your email for confirmation",
        });
      } catch (error) {
        toast({
          title: "Failed to Send Request",
          description: "Please try WhatsApp instead",
          variant: "destructive",
        });
      }
    }

    setIsSubmitting(false);
    setCheckoutDialogOpen(false);
    setFacultyId("");
    setSelectedPlanId("");
  };

  const filteredPlans = departmentPlans.filter((plan) => plan.category === activeCategory);

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Build Your Learning Path</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Choose your courses, benefits, and learning mode. Pay for exactly what you need.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Badge variant="outline" className="text-sm">
              Minimum Investment: ₦{MINIMUM_AMOUNT.toLocaleString()}
            </Badge>
            <Badge variant="secondary" className="text-sm">Dynamic Pricing Active</Badge>
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as PlanCategory)} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="data-ai">Data & AI</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredPlans.map((plan) => {
            const Icon = plan.icon;
            const total = totalPrices[plan.id] || 0;
            const meetsMinimum = plan.isFree || total >= MINIMUM_AMOUNT;

            if (plan.isFree) {
              return (
                <Card key={plan.id} className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">Free</Badge>
                    </div>
                    <CardTitle>{plan.fancyName}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.courses.map((course) => (
                        <li key={course.id} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span className="text-muted-foreground">{course.name}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleStartFree} className="w-full">
                      Start Free
                    </Button>
                  </CardFooter>
                </Card>
              );
            }

            return (
              <Card key={plan.id} className="border-2 border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₦{total.toLocaleString()}</p>
                      {!meetsMinimum && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Min: ₦{MINIMUM_AMOUNT.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <CardTitle>{plan.fancyName}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CourseSelector
                    courses={plan.courses}
                    selectedCourses={selections[plan.id]?.selectedCourses || []}
                    onToggleCourse={(courseId) => handleToggleCourse(plan.id, courseId)}
                  />
                  <LearningModeSelector
                    modes={plan.learningModes}
                    selectedMode={selections[plan.id]?.learningMode || plan.learningModes[0]?.id}
                    onSelectMode={(modeId) => handleSelectLearningMode(plan.id, modeId)}
                  />
                  <BenefitSelector
                    benefits={plan.benefits}
                    selectedBenefits={selections[plan.id]?.selectedBenefits || []}
                    onToggleBenefit={(benefitId) => handleToggleBenefit(plan.id, benefitId)}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSubmitRequest(plan.id)}
                    disabled={!meetsMinimum}
                    className="w-full"
                  >
                    Submit Request
                  </Button>
                </CardFooter>
              </Card>
            );
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
