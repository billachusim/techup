import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { UserPlus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const GetStarted = () => {
  const [facultyId, setFacultyId] = useState("");
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    hearAbout: "",
  });
  const { toast } = useToast();

  const generateFacultyId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TF-${timestamp}-${random}`;
  };

  const handleFacultyIdSubmit = () => {
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

    const message = `Hi! I'm ready to access Tech Faculty benefits. My Faculty ID is: ${facultyId.trim()}`;
    const whatsappUrl = `https://wa.me/2348145607519?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setFacultyId("");
  };

  const handleSignUpSubmit = () => {
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
    const message = `Hi! I'd like to register for Tech Faculty.

*My Details:*
Name: ${formData.name.trim()}
Email: ${formData.email.trim()}
Phone: ${formData.phone.trim()}
Interested in: ${formData.course}
How I heard about you: ${formData.hearAbout}

*My Faculty ID: ${newFacultyId}*`;

    const whatsappUrl = `https://wa.me/2348145607519?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    setShowSignUpForm(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
      hearAbout: "",
    });

    toast({
      title: "Registration Submitted!",
      description: `Your Faculty ID (${newFacultyId}) has been sent to WhatsApp.`,
    });
  };

  return (
    <section id="get-started" className="py-24 px-4 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Get Started Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Already have a Faculty ID? Enter it below to access exclusive benefits.
            Don't have one? Sign up now!
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Faculty ID Input */}
              <div className="space-y-4">
                <Label htmlFor="facultyId" className="text-lg font-semibold">
                  Enter Your Faculty ID
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="facultyId"
                    placeholder="e.g., TF-ABC123XYZ"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value.toUpperCase())}
                    className="flex-1 text-base"
                    maxLength={50}
                  />
                  <Button
                    size="lg"
                    onClick={handleFacultyIdSubmit}
                    className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90"
                  >
                    <Sparkles className="mr-2" size={20} />
                    Access Now
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">
                    Don't have a Faculty ID?
                  </span>
                </div>
              </div>

              {/* Sign Up Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowSignUpForm(true)}
                  className="w-full sm:w-auto"
                >
                  <UserPlus className="mr-2" size={20} />
                  Get Your Faculty ID
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Form Dialog */}
        <Dialog open={showSignUpForm} onOpenChange={setShowSignUpForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Get Your Faculty ID</DialogTitle>
              <DialogDescription>
                Fill in your details to receive your unique Faculty ID and join our community.
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
                size="lg"
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

export default GetStarted;