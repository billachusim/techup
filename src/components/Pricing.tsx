import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignupForm } from "./Auth/SignupForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ShieldCheck, Users, Trophy, AlertCircle, Code, Database, Shield, Cloud, Palette, TrendingUp, Sparkles, Smartphone } from "lucide-react";
import { CourseSelector } from "./Pricing/CourseSelector";
import { BenefitSelector } from "./Pricing/BenefitSelector";
import { LearningModeSelector } from "./Pricing/LearningModeSelector";
import { CheckoutDialog } from "./Pricing/CheckoutDialog";
import { useCurrency } from "@/contexts/CurrencyContext";

type PlanCategory = "beginner" | "development" | "data-ai" | "creative" | "security" | "custom";

interface Course {
  id: string;
  name: string;
  price: number;
  category?: string;
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
  isCustom?: boolean;
  minimumAmount: number;
}

interface Selection {
  selectedCourses: string[];
  selectedBenefits: string[];
  learningMode: string;
}

const LEARNING_MODES = [
  { id: "online-only", name: "Online Only", price: 0, description: "Self-paced learning with recorded lectures" },
  { id: "hybrid", name: "Hybrid Mode", price: 12000, description: "Online + Monthly physical meetups" },
  { id: "physical", name: "Physical Classes", price: 22500, description: "Weekly on-site classes" },
];

// All available courses for custom builder
const allAvailableCourses: Course[] = [
  { id: "html-css", name: "HTML/CSS Fundamentals", price: 7500, category: "Web Development" },
  { id: "javascript", name: "JavaScript Mastery", price: 12000, category: "Web Development" },
  { id: "react", name: "React Development", price: 18000, category: "Web Development" },
  { id: "nodejs", name: "Node.js & Backend", price: 18000, category: "Web Development" },
  { id: "database", name: "Database Management", price: 12000, category: "Web Development" },
  { id: "fullstack-projects", name: "Full-Stack Projects", price: 15000, category: "Web Development" },
  { id: "python", name: "Python Programming", price: 10500, category: "Data Science" },
  { id: "sql", name: "SQL & Databases", price: 9000, category: "Data Science" },
  { id: "data-viz", name: "Data Visualization", price: 12000, category: "Data Science" },
  { id: "statistics", name: "Statistical Analysis", price: 13500, category: "Data Science" },
  { id: "ml-basics", name: "Machine Learning Basics", price: 22500, category: "AI/ML" },
  { id: "deep-learning", name: "Deep Learning", price: 27000, category: "AI/ML" },
  { id: "neural-networks", name: "Neural Networks", price: 22500, category: "AI/ML" },
  { id: "nlp", name: "NLP Fundamentals", price: 21000, category: "AI/ML" },
  { id: "computer-vision", name: "Computer Vision", price: 21000, category: "AI/ML" },
  { id: "ai-deployment", name: "AI Deployment", price: 15000, category: "AI/ML" },
  { id: "network-security", name: "Network Security", price: 15000, category: "Cybersecurity" },
  { id: "ethical-hacking", name: "Ethical Hacking", price: 22500, category: "Cybersecurity" },
  { id: "soc-ops", name: "SOC Operations", price: 18000, category: "Cybersecurity" },
  { id: "incident-response", name: "Incident Response", price: 12000, category: "Cybersecurity" },
  { id: "comptia-prep", name: "CompTIA Prep", price: 15000, category: "Cybersecurity" },
  { id: "ceh-prep", name: "CEH Prep", price: 18000, category: "Cybersecurity" },
  { id: "aws", name: "AWS Fundamentals", price: 18000, category: "Cloud/DevOps" },
  { id: "azure", name: "Azure Basics", price: 18000, category: "Cloud/DevOps" },
  { id: "gcp", name: "GCP Essentials", price: 18000, category: "Cloud/DevOps" },
  { id: "kubernetes", name: "Kubernetes & Docker", price: 22500, category: "Cloud/DevOps" },
  { id: "cicd", name: "CI/CD Pipelines", price: 15000, category: "Cloud/DevOps" },
  { id: "cloud-cert", name: "Cloud Certifications", price: 12000, category: "Cloud/DevOps" },
  { id: "figma", name: "Figma Mastery", price: 12000, category: "Design" },
  { id: "adobe", name: "Adobe Suite", price: 15000, category: "Design" },
  { id: "product-design", name: "Product Design", price: 18000, category: "Design" },
  { id: "design-principles", name: "Design Principles", price: 9000, category: "Design" },
  { id: "design-systems", name: "Design Systems", price: 13500, category: "Design" },
  { id: "portfolio-projects", name: "Portfolio Projects", price: 10500, category: "Design" },
  { id: "social-media", name: "Social Media Strategy", price: 10500, category: "Marketing" },
  { id: "content-marketing", name: "Content Marketing", price: 12000, category: "Marketing" },
  { id: "seo-sem", name: "SEO/SEM", price: 15000, category: "Marketing" },
  { id: "video-editing", name: "Video Editing", price: 13500, category: "Marketing" },
  { id: "photo-editing", name: "Photo Editing", price: 9000, category: "Marketing" },
  { id: "analytics", name: "Analytics & Growth", price: 12000, category: "Marketing" },
  { id: "react-native", name: "React Native Development", price: 18000, category: "Mobile Development" },
  { id: "flutter-dart", name: "Flutter & Dart", price: 18000, category: "Mobile Development" },
  { id: "ios-swift", name: "iOS with Swift", price: 21000, category: "Mobile Development" },
  { id: "android-kotlin", name: "Android with Kotlin", price: 21000, category: "Mobile Development" },
  { id: "mobile-uiux", name: "Mobile UI/UX Design", price: 12000, category: "Mobile Development" },
  { id: "cross-platform-projects", name: "Cross-Platform Projects", price: 15000, category: "Mobile Development" },
];

const departmentPlans: DepartmentPlan[] = [
  {
    id: "bootcamp-starter",
    name: "Bootcamp Starter",
    fancyName: "Free Foundation",
    icon: Users,
    category: "beginner",
    description: "Start your tech journey with essential free courses",
    isFree: true,
    minimumAmount: 0,
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
      { id: "community", name: "Community Access", price: 0, description: "Join our vibrant tech community" },
      { id: "self-paced", name: "Self-Paced Learning", price: 0, description: "Learn at your own pace" },
      { id: "basic-certificate", name: "Completion Certificate", price: 0, description: "Get certified on completion" },
    ],
  },
  {
    id: "developer-pro",
    name: "Developer Pro",
    fancyName: "Web Development Mastery",
    icon: Code,
    category: "development",
    description: "Master full-stack web development from scratch",
    minimumAmount: 50000,
    courses: [
      { id: "html-css", name: "HTML/CSS Fundamentals", price: 7500 },
      { id: "javascript", name: "JavaScript Mastery", price: 12000 },
      { id: "react", name: "React Development", price: 18000 },
      { id: "nodejs", name: "Node.js & Backend", price: 18000 },
      { id: "database", name: "Database Management", price: 12000 },
      { id: "fullstack-projects", name: "Full-Stack Projects", price: 15000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 15000, description: "Get help finding your first job" },
      { id: "internship", name: "Internship Access", price: 12000, description: "Access to partner internships" },
      { id: "mentor-network", name: "Mentor Network Access", price: 18000, description: "Connect with industry mentors" },
      { id: "certification-prep", name: "Industry Certification Prep", price: 22500, description: "Prepare for industry certifications" },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0, description: "Official completion certificate" },
    ],
  },
  {
    id: "data-wizard",
    name: "Data Wizard",
    fancyName: "Data Science & Analytics",
    icon: Database,
    category: "data-ai",
    description: "Become a data science expert and unlock insights",
    minimumAmount: 100000,
    courses: [
      { id: "python", name: "Python Programming", price: 10500 },
      { id: "sql", name: "SQL & Databases", price: 9000 },
      { id: "data-viz", name: "Data Visualization", price: 12000 },
      { id: "statistics", name: "Statistical Analysis", price: 13500 },
      { id: "ml-basics", name: "Machine Learning Basics", price: 22500 },
      { id: "data-projects", name: "Real-world Data Projects", price: 15000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 15000, description: "Get help finding your first job" },
      { id: "internship", name: "Internship Access", price: 12000, description: "Access to partner internships" },
      { id: "mentor-network", name: "Mentor Network Access", price: 18000, description: "Connect with industry mentors" },
      { id: "one-on-one", name: "One-on-One Mentorship (1hr/week)", price: 30000, description: "Personal guidance from experts" },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0, description: "Official completion certificate" },
    ],
  },
  {
    id: "ai-innovator",
    name: "AI Innovator",
    fancyName: "AI & Machine Learning",
    icon: Sparkles,
    category: "data-ai",
    description: "Lead the AI revolution with cutting-edge skills",
    minimumAmount: 150000,
    courses: [
      { id: "deep-learning", name: "Deep Learning", price: 27000 },
      { id: "neural-networks", name: "Neural Networks", price: 22500 },
      { id: "tensorflow-pytorch", name: "TensorFlow/PyTorch", price: 18000 },
      { id: "nlp", name: "NLP Fundamentals", price: 21000 },
      { id: "computer-vision", name: "Computer Vision", price: 21000 },
      { id: "ai-deployment", name: "AI Deployment", price: 15000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 15000, description: "Get help finding your first job" },
      { id: "internship", name: "Internship Access", price: 12000, description: "Access to partner internships" },
      { id: "mentor-network", name: "Mentor Network Access", price: 18000, description: "Connect with industry mentors" },
      { id: "one-on-one", name: "One-on-One Mentorship (1hr/week)", price: 30000, description: "Personal guidance from experts" },
      { id: "vip-classes", name: "VIP Classes at Chosen Location", price: 75000, description: "Premium learning experience" },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0, description: "Official completion certificate" },
    ],
  },
  {
    id: "security-shield",
    name: "Security Shield",
    fancyName: "Cybersecurity & Ethical Hacking",
    icon: Shield,
    category: "security",
    description: "Master cybersecurity and protect digital assets",
    minimumAmount: 120000,
    courses: [
      { id: "network-security", name: "Network Security", price: 15000 },
      { id: "ethical-hacking", name: "Ethical Hacking", price: 22500 },
      { id: "soc-ops", name: "SOC Operations", price: 18000 },
      { id: "incident-response", name: "Incident Response", price: 12000 },
      { id: "comptia-prep", name: "CompTIA Prep", price: 15000 },
      { id: "ceh-prep", name: "CEH Prep", price: 18000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 15000, description: "Get help finding your first job" },
      { id: "internship", name: "Internship Access", price: 12000, description: "Access to partner internships" },
      { id: "mentor-network", name: "Mentor Network Access", price: 18000, description: "Connect with industry mentors" },
      { id: "certification-prep", name: "Industry Certification Prep", price: 22500, description: "Prepare for industry certifications" },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0, description: "Official completion certificate" },
    ],
  },
  {
    id: "mobile-app-developer",
    name: "Mobile App Developer",
    fancyName: "Mobile App Development",
    icon: Smartphone,
    category: "development",
    description: "Build powerful mobile apps for iOS and Android",
    minimumAmount: 80000,
    courses: [
      { id: "react-native", name: "React Native Development", price: 18000 },
      { id: "flutter-dart", name: "Flutter & Dart", price: 18000 },
      { id: "ios-swift", name: "iOS with Swift", price: 21000 },
      { id: "android-kotlin", name: "Android with Kotlin", price: 21000 },
      { id: "mobile-uiux", name: "Mobile UI/UX Design", price: 12000 },
      { id: "cross-platform-projects", name: "Cross-Platform Projects", price: 15000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 15000, description: "Get help finding your first job" },
      { id: "internship", name: "Internship Access", price: 12000, description: "Access to partner internships" },
      { id: "mentor-network", name: "Mentor Network Access", price: 18000, description: "Connect with industry mentors" },
      { id: "certification-prep", name: "Industry Certification Prep", price: 22500, description: "Prepare for industry certifications" },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0, description: "Official completion certificate" },
    ],
  },
  {
    id: "cloud-architect",
    name: "Cloud Architect",
    fancyName: "Cloud Computing & DevOps",
    icon: Cloud,
    category: "development",
    description: "Master cloud platforms and modern DevOps practices",
    minimumAmount: 130000,
    courses: [
      { id: "aws", name: "AWS Fundamentals", price: 18000 },
      { id: "azure", name: "Azure Basics", price: 18000 },
      { id: "gcp", name: "GCP Essentials", price: 18000 },
      { id: "kubernetes", name: "Kubernetes & Docker", price: 22500 },
      { id: "cicd", name: "CI/CD Pipelines", price: 15000 },
      { id: "cloud-cert", name: "Cloud Certifications", price: 12000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 15000, description: "Get help finding your first job" },
      { id: "internship", name: "Internship Access", price: 12000, description: "Access to partner internships" },
      { id: "mentor-network", name: "Mentor Network Access", price: 18000, description: "Connect with industry mentors" },
      { id: "certification-prep", name: "Industry Certification Prep", price: 22500, description: "Prepare for industry certifications" },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0, description: "Official completion certificate" },
    ],
  },
  {
    id: "design-master",
    name: "Design Master",
    fancyName: "UI/UX Design Excellence",
    icon: Palette,
    category: "creative",
    description: "Create stunning user experiences and interfaces",
    minimumAmount: 70000,
    courses: [
      { id: "design-principles", name: "Design Principles", price: 9000 },
      { id: "figma", name: "Figma Mastery", price: 12000 },
      { id: "adobe", name: "Adobe Suite", price: 15000 },
      { id: "product-design", name: "Product Design", price: 18000 },
      { id: "design-systems", name: "Design Systems", price: 13500 },
      { id: "portfolio-projects", name: "Portfolio Projects", price: 10500 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 15000, description: "Get help finding your first job" },
      { id: "internship", name: "Internship Access", price: 12000, description: "Access to partner internships" },
      { id: "mentor-network", name: "Mentor Network Access", price: 18000, description: "Connect with industry mentors" },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0, description: "Official completion certificate" },
    ],
  },
  {
    id: "digital-marketing-pro",
    name: "Digital Marketing Pro",
    fancyName: "Digital Marketing & Growth",
    icon: TrendingUp,
    category: "creative",
    description: "Master digital marketing and growth strategies",
    minimumAmount: 60000,
    courses: [
      { id: "social-media", name: "Social Media Strategy", price: 10500 },
      { id: "content-marketing", name: "Content Marketing", price: 12000 },
      { id: "seo-sem", name: "SEO/SEM", price: 15000 },
      { id: "video-editing", name: "Video Editing", price: 13500 },
      { id: "photo-editing", name: "Photo Editing", price: 9000 },
      { id: "analytics", name: "Analytics & Growth", price: 12000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 15000, description: "Get help finding your first job" },
      { id: "internship", name: "Internship Access", price: 12000, description: "Access to partner internships" },
      { id: "mentor-network", name: "Mentor Network Access", price: 18000, description: "Connect with industry mentors" },
      { id: "tech-certificate", name: "Tech Faculty Certificate", price: 0, description: "Official completion certificate" },
    ],
  },
  {
    id: "custom-builder",
    name: "Custom Program",
    fancyName: "Build Your Own Path",
    icon: Trophy,
    category: "custom",
    description: "Create your own custom learning journey",
    isCustom: true,
    minimumAmount: 50000,
    courses: [],
    learningModes: LEARNING_MODES,
    benefits: [
      { id: "job-placement", name: "Job Placement Support", price: 15000, description: "Get help finding your first job" },
      { id: "internship", name: "Internship Access", price: 12000, description: "Access to partner internships" },
      { id: "mentor-network", name: "Mentor Network Access", price: 18000, description: "Connect with industry mentors" },
      { id: "certification-prep", name: "Industry Certification Prep", price: 22500, description: "Prepare for industry certifications" },
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
  const [discountCode, setDiscountCode] = useState("");
  const [requestDiscount, setRequestDiscount] = useState(false);
  const [customCourseSearch, setCustomCourseSearch] = useState("");
  const [userHasPaidPlan, setUserHasPaidPlan] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const { toast } = useToast();
  const { formatPrice, symbol, convertPrice, isNigeria } = useCurrency();

  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [totalPrices, setTotalPrices] = useState<Record<string, number>>({});

  // Check if user has paid plan and fetch enrollment data
  useEffect(() => {
    const checkUserPlan = async () => {
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

  const handleSubmitRequest = (planId: string) => {
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
    
    try {
      const plan = departmentPlans.find((p) => p.id === selectedPlanId);
      if (!plan) return;

      const selection = selections[selectedPlanId];
      const total = totalPrices[selectedPlanId];

      // Get current user profile
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
      const { data: newFacultyId, error: idError } = await (supabase.rpc as any)('generate_faculty_id', {
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

      // Update faculty_ids table
      await supabase
        .from("faculty_ids")
        .update({
          faculty_id: newFacultyId,
          department: plan.name,
        })
        .eq('faculty_id', currentFacultyId);

      // Update all related records with new faculty ID
      await Promise.all([
        supabase.from("enrollments").update({ faculty_id: newFacultyId, learning_mode: selectedMode }).eq('faculty_id', currentFacultyId),
        supabase.from("course_enrollments").update({ faculty_id: newFacultyId }).eq('faculty_id', currentFacultyId),
        supabase.from("course_progress").update({ faculty_id: newFacultyId }).eq('faculty_id', currentFacultyId),
      ]);

      // Create new enrollment with status based on plan type
      const enrollmentStatus = plan.isFree ? "active" : "pending";
      await supabase.from("enrollments").insert({
        faculty_id: newFacultyId,
        plan_name: plan.name,
        status: enrollmentStatus,
        learning_mode: selectedMode,
      });

    const courses = plan.isCustom 
      ? allAvailableCourses.filter(c => selection.selectedCourses.includes(c.id))
      : plan.courses;

    const selectedCourseDetails = selection.selectedCourses.map((id) => {
      const course = courses.find((c) => c.id === id);
      return course ? `${course.name} - ${formatPrice(course.price)}` : '';
    }).filter(Boolean);

    const selectedBenefitDetails = selection.selectedBenefits.map((id) => {
      const benefit = plan.benefits.find((b) => b.id === id);
      return benefit ? `${benefit.name} - ${formatPrice(benefit.price)}` : '';
    }).filter(Boolean);

    const learningModeDetail = plan.learningModes.find((m) => m.id === selection.learningMode);

    const discountInfo = requestDiscount 
      ? "\n*Requesting Discount Code*" 
      : (discountCode ? `\n*Discount Code Applied:* ${discountCode.toUpperCase()}` : "");

      const message = `Hi Tech Faculty NG Team! 👋

I'm ready to enroll in *${plan.fancyName}*

*New Faculty ID:* ${newFacultyId}
*(Previous ID: ${currentFacultyId})*
*Total Amount:* ${formatPrice(total)}${discountInfo}

*Selected Courses:*
${selectedCourseDetails.length > 0 ? selectedCourseDetails.map(c => `✓ ${c}`).join('\n') : 'No courses selected'}

*Learning Mode:* ${learningModeDetail?.name} - ${learningModeDetail?.price === 0 ? 'Included' : formatPrice(learningModeDetail?.price || 0)}

*Additional Benefits:*
${selectedBenefitDetails.length > 0 ? selectedBenefitDetails.map(b => `✓ ${b}`).join('\n') : 'No benefits selected'}

*Payment Status:* Pending Payment

Please process my enrollment!`;

      if (method === 'whatsapp') {
        const whatsappUrl = `https://wa.me/2348068597140?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        toast({
          title: "Enrollment Successful!",
          description: `Your new Faculty ID is ${newFacultyId}. Complete the request on WhatsApp.`,
        });
      } else {
        const emailSubject = `Enrollment Request - ${newFacultyId} - ${plan.fancyName}`;
        const emailBody = message.replace(/\*/g, '').replace(/✓/g, '-');
        const mailtoUrl = `mailto:thetechfaculty@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoUrl;

        toast({
          title: "Enrollment Successful!",
          description: `Your new Faculty ID is ${newFacultyId}. Complete the request via email.`,
        });
      }

      setIsSubmitting(false);
      setCheckoutDialogOpen(false);
      setFacultyId("");
      setSelectedPlanId("");
      
      // Reload to refresh user context with new faculty ID
      setTimeout(() => window.location.reload(), 2000);
      
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: error.message || "An error occurred during enrollment",
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
                  Min: ₦{plan.minimumAmount.toLocaleString()}
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
                      <span className="text-sm font-semibold">₦{course.price.toLocaleString()}</span>
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
                ₦{total.toLocaleString()}
              </Badge>
              {!meetsMinimum && (
                <p className="text-xs text-destructive flex items-center gap-1 justify-end mt-1">
                  <AlertCircle className="h-3 w-3" />
                  Min: ₦{plan.minimumAmount.toLocaleString()}
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
