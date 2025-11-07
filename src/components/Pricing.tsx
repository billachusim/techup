import { Check, Sparkles, Zap, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const pricingPlans = [
  {
    name: "Bootcamp Starter",
    icon: Sparkles,
    price: "Free",
    description: "Perfect for beginners exploring tech careers",
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
    isFree: true,
  },
  {
    name: "Developer Pro",
    icon: Zap,
    price: "$299",
    period: "/3 months",
    description: "Comprehensive web development mastery",
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
    isFree: false,
  },
  {
    name: "Data Wizard",
    icon: Rocket,
    price: "$349",
    period: "/3 months",
    description: "Master data science and analytics",
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
    isFree: false,
  },
  {
    name: "Security Shield",
    icon: Rocket,
    price: "$399",
    period: "/4 months",
    description: "Become a cybersecurity expert",
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
    isFree: false,
  },
  {
    name: "AI Innovator",
    icon: Rocket,
    price: "$449",
    period: "/4 months",
    description: "Build cutting-edge AI solutions",
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
    isFree: false,
  },
  {
    name: "Cloud Architect",
    icon: Rocket,
    price: "$379",
    period: "/3 months",
    description: "Master cloud platforms and DevOps",
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
    isFree: false,
  },
  {
    name: "Design Master",
    icon: Sparkles,
    price: "$279",
    period: "/3 months",
    description: "Master visual design and user experience",
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
    isFree: false,
  },
  {
    name: "Digital Marketing Pro",
    icon: Zap,
    price: "$259",
    period: "/3 months",
    description: "Master digital marketing and content creation",
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    hearAbout: "",
  });
  const { toast } = useToast();

  const handleCouponChange = (planName: string, value: string) => {
    setCouponCodes({ ...couponCodes, [planName]: value });
  };

  const generateFacultyId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TF-${timestamp}-${random}`;
  };

  const handlePlanClick = (planName: string) => {
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

  const handleSignUpSubmit = async () => {
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.course || !formData.hearAbout) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone
    if (formData.phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    const newFacultyId = generateFacultyId();
    
    // Save to database
    const { error: facultyError } = await supabase
      .from('faculty_ids')
      .insert({
        faculty_id: newFacultyId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course_interest: formData.course,
        hear_about_us: formData.hearAbout,
        status: 'active'
      });

    if (facultyError) {
      console.error('Error saving Faculty ID:', facultyError);
      toast({
        title: "Registration Error",
        description: "Unable to complete registration. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Save enrollment to database
    const { error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        faculty_id: newFacultyId,
        plan_name: selectedPlan,
        coupon_code: couponCodes[selectedPlan] || null,
        status: 'pending'
      });

    if (enrollmentError) {
      console.error('Error saving enrollment:', enrollmentError);
    }

    const plan = pricingPlans.find((p) => p.name === selectedPlan);
    const planMessage = plan?.isFree
      ? `I'm registering for the *${selectedPlan}* (Free Bootcamp).`
      : `I'm ready to pay for *${selectedPlan}*.`;

    const message = `Hi! ${planMessage}

*My Details:*
Name: ${formData.name.trim()}
Email: ${formData.email.trim()}
Phone: ${formData.phone.trim()}
Interested in: ${formData.course}
How I heard about you: ${formData.hearAbout}

*My Faculty ID: ${newFacultyId}*`;

    const whatsappUrl = `https://wa.me/2348068597140?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    setShowSignUpForm(false);
    setShowFacultyIdDialog(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
      hearAbout: "",
    });

    toast({
      title: "Registration Successful!",
      description: `Your Faculty ID (${newFacultyId}) has been saved and sent to WhatsApp.`,
    });
  };

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible packages designed for every career goal. All paid plans include
            our 100% ROI guarantee.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-8 min-w-max">
              {pricingPlans.map((plan, idx) => {
                const Icon = plan.icon;
                return (
                  <Card
                    key={idx}
                    className={`relative bg-card border-border w-[350px] flex-shrink-0 ${
                      plan.popular ? "border-primary" : ""
                    }`}
                  >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="mx-auto p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="text-4xl font-bold text-gradient">
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
                      <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
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
                      <p className="text-xs text-muted-foreground mt-1">
                        Apply coupon for 50% off
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => handlePlanClick(plan.name)}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Need a Custom Package?
              </h3>
              <p className="text-muted-foreground mb-6">
                Looking for corporate training or a personalized learning path? Book a
                call with our team to create the perfect plan for your goals.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-primary-foreground hover:opacity-90"
                onClick={() => window.open("https://calendly.com/techfaculty/30min", "_blank")}
              >
                Book a Call
              </Button>
            </CardContent>
          </Card>
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
              <DialogTitle>Get Your Faculty ID</DialogTitle>
              <DialogDescription>
                Fill in your details to receive your unique Faculty ID.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course Interest *</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => setFormData({ ...formData, course: value })}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hearAbout">How did you hear about us? *</Label>
                <Select
                  value={formData.hearAbout}
                  onValueChange={(value) => setFormData({ ...formData, hearAbout: value })}
                >
                  <SelectTrigger id="hearAbout">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {hearAboutUs.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSignUpSubmit}
                className="w-full bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90"
              >
                Submit & Get Faculty ID
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Pricing;
