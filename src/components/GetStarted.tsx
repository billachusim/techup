import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { UserPlus, Sparkles, LogOut, Calendar, Users, BookOpen, ExternalLink, MessageCircle, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [showForgotIdDialog, setShowForgotIdDialog] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [lecturesData, setLecturesData] = useState<any[]>([]);
  const [nextLecture, setNextLecture] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    hearAbout: "",
  });
  const [forgotIdData, setForgotIdData] = useState({
    email: "",
    phone: "",
  });
  const { toast } = useToast();
  const { isLoggedIn, userData, login, logout, setUserData } = useUser();

  const generateFacultyId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TF-${timestamp}-${random}`;
  };

  const fetchUserDashboardData = async (facultyIdToFetch: string) => {
    try {
      // Fetch user data
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty_ids')
        .select('*')
        .eq('faculty_id', facultyIdToFetch)
        .single();

      if (facultyError) throw facultyError;

      setUserData(facultyData);

      // Fetch enrollment data
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('faculty_id', facultyIdToFetch)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setEnrollmentData(enrollment);

      const planName = enrollment?.plan_name || "free_bootcamp";
      
      // Map plan names to database format
      const planMapping: { [key: string]: string } = {
        "Free Bootcamp": "free_bootcamp",
        "Bootcamp Starter": "bootcamp_starter",
        "Developer Pro": "developer_pro",
      };

      const dbPlanName = planMapping[enrollment?.plan_name] || "free_bootcamp";

      // Fetch courses filtered by plan
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('plan_required', dbPlanName);

      const coursesAvailable = courses || [];

      // Auto-enroll user in plan courses if not already enrolled
      if (coursesAvailable.length > 0) {
        for (const course of coursesAvailable) {
          const { data: existingEnrollment } = await supabase
            .from('course_enrollments')
            .select('id')
            .eq('faculty_id', facultyIdToFetch)
            .eq('course_id', course.id)
            .maybeSingle();

          if (!existingEnrollment) {
            await supabase
              .from('course_enrollments')
              .insert({
                faculty_id: facultyIdToFetch,
                course_id: course.id,
                status: 'active',
              });
          }
        }
      }

      // Fetch enrollments for these courses
      const { data: courseEnrollments } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (*),
          course_progress (*)
        `)
        .eq('faculty_id', facultyIdToFetch)
        .in('course_id', coursesAvailable.map((c: any) => c.id));

      setCoursesData(courseEnrollments || []);

      // Fetch all lectures for enrolled courses
      if (courseEnrollments && courseEnrollments.length > 0) {
        const courseIds = courseEnrollments.map((ce: any) => ce.course_id);
        
        const { data: allLectures } = await supabase
          .from('lectures')
          .select('*, courses (*)')
          .in('course_id', courseIds)
          .order('scheduled_at', { ascending: true });

        setLecturesData(allLectures || []);

        // Find next uncompleted lecture
        const { data: progressRecords } = await supabase
          .from('course_progress')
          .select('*')
          .eq('faculty_id', facultyIdToFetch);

        const completedLectures = new Set(
          progressRecords?.map((p: any) => p.last_accessed) || []
        );

        const nextUncompletedLecture = allLectures?.find(
          (lecture: any) => !completedLectures.has(lecture.id)
        );

        setNextLecture(nextUncompletedLecture || allLectures?.[0] || null);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?.faculty_id) {
      fetchUserDashboardData(userData.faculty_id);
    }
  }, [isLoggedIn, userData?.faculty_id]);

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

    // Faculty ID verified, login and fetch dashboard data
    login(facultyId.trim(), facultyData);
    await fetchUserDashboardData(facultyId.trim());
    
    toast({
      title: "Welcome Back!",
      description: `Signed in as ${facultyData.name}`,
    });
  };

  const handleSignOut = () => {
    logout();
    setEnrollmentData(null);
    setCoursesData([]);
    setLecturesData([]);
    setNextLecture(null);
    setFacultyId("");
    
    toast({
      title: "Signed Out",
      description: "You've been signed out successfully.",
    });
  };

  const handleLectureComplete = async (lectureId: string, courseId: string) => {
    if (!userData?.faculty_id) return;

    try {
      // Get or create course progress record
      const { data: existingProgress } = await supabase
        .from('course_progress')
        .select('*')
        .eq('faculty_id', userData.faculty_id)
        .eq('course_id', courseId)
        .maybeSingle();

      // Calculate new progress percentage
      const totalLectures = lecturesData.filter((l: any) => l.course_id === courseId).length;
      const completedCount = existingProgress ? existingProgress.progress_percentage / 100 * totalLectures + 1 : 1;
      const newProgress = Math.min(Math.round((completedCount / totalLectures) * 100), 100);

      if (existingProgress) {
        await supabase
          .from('course_progress')
          .update({
            progress_percentage: newProgress,
            last_accessed: lectureId,
            updated_at: new Date().toISOString(),
            ...(newProgress === 100 ? { completed_at: new Date().toISOString() } : {})
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('course_progress')
          .insert({
            faculty_id: userData.faculty_id,
            course_id: courseId,
            progress_percentage: newProgress,
            last_accessed: lectureId,
            ...(newProgress === 100 ? { completed_at: new Date().toISOString() } : {})
          });
      }

      // Refresh dashboard data
      await fetchUserDashboardData(userData.faculty_id);

      toast({
        title: "Progress Updated",
        description: "Lecture marked as completed!",
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleForgotIdSubmit = () => {
    if (!forgotIdData.email.trim() || !forgotIdData.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and phone number.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotIdData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const message = `Hi! I forgot my Faculty ID. Please help me recover it.

*My Details:*
Email: ${forgotIdData.email.trim()}
Phone: ${forgotIdData.phone.trim()}

Please confirm my Faculty ID. Thank you!`;

    const whatsappUrl = `https://wa.me/2348068597140?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    setShowForgotIdDialog(false);
    setForgotIdData({ email: "", phone: "" });
    
    toast({
      title: "Request Sent",
      description: "Your Faculty ID recovery request has been sent via WhatsApp.",
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
    const { error } = await supabase
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

    if (error) {
      console.error('Error saving Faculty ID:', error);
      toast({
        title: "Registration Error",
        description: "Unable to complete registration. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const message = `Hi! I'd like to register for Tech Faculty.

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
    <section id="see-how-you-are-doing" className="py-24 px-4 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto max-w-6xl">
        {!isLoggedIn ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                See How You Are{" "}
                <span className="bg-gradient-to-r from-primary via-[hsl(170,100%,47%)] to-[hsl(180,100%,45%)] bg-clip-text text-transparent">
                  Doing
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Login with your Faculty ID to see your progress, join communities, and know when is your next class. Already part of the Tech Faculty family? Access your personalized dashboard now!
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
                    <div className="flex flex-col sm:flex-row gap-3">
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
                        className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90 w-full sm:w-auto"
                      >
                        <Sparkles className="mr-2" size={20} />
                        Access Now
                      </Button>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => setShowForgotIdDialog(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot your Faculty ID?
                      </button>
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
          </>
        ) : (
          /* Profile Dashboard */
          <div className="space-y-6">
            {/* Header with Sign Out */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome Back, {userData?.name}!
                </h2>
                <p className="text-muted-foreground">
                  Your Faculty ID: <span className="font-mono font-semibold text-foreground">{userData?.faculty_id}</span>
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2" size={18} />
                Sign Out
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Profile Info Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="text-primary" size={20} />
                    Your Profile
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span className="font-medium">{userData?.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">{userData?.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department:</span>{" "}
                      <span className="font-medium">{userData?.department || "Not assigned"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Plan:</span>{" "}
                      <Badge variant={enrollmentData?.plan_name === "Developer Pro" ? "default" : "secondary"}>
                        {enrollmentData?.plan_name || "Free Bootcamp"}
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const message = `Hi! I'm ${userData?.name}. My Faculty ID is: ${userData?.faculty_id}. I'd like to join the Tech Faculty community.`;
                        window.open(`https://chat.whatsapp.com/GCnw88T0nxs5oabYgcqXKt?text=${encodeURIComponent(message)}`, "_blank");
                      }}
                    >
                      <MessageCircle className="mr-2" size={16} />
                      Join Community WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Next Lecture Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Calendar className="text-primary" size={20} />
                    Next Class
                  </h3>
                  {nextLecture ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">{nextLecture.title}</h4>
                        <p className="text-sm text-muted-foreground">{nextLecture.courses?.name}</p>
                      </div>
                      <div className="text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>{" "}
                          <span className="font-medium">
                            {new Date(nextLecture.scheduled_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>{" "}
                          <span className="font-medium">
                            {new Date(nextLecture.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      {nextLecture.meeting_link && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(nextLecture.meeting_link, "_blank")}
                        >
                          Join Class
                          <ExternalLink className="ml-2" size={16} />
                        </Button>
                      )}
                      {nextLecture.courses?.whatsapp_group_link && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(nextLecture.courses.whatsapp_group_link, "_blank")}
                        >
                          <MessageCircle className="mr-2" size={16} />
                          Class WhatsApp Group
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="mx-auto mb-2 opacity-50" size={32} />
                      <p>No upcoming classes scheduled yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Courses and Progress */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="text-primary" size={20} />
                  Your Courses
                </h3>
                {coursesData.length > 0 ? (
                  <div className="space-y-6">
                    {coursesData.map((enrollment: any) => {
                      const progress = enrollment.course_progress?.[0]?.progress_percentage || 0;
                      const courseLectures = lecturesData.filter((l: any) => l.course_id === enrollment.course_id);
                      const completedLectureId = enrollment.course_progress?.[0]?.last_accessed;
                      
                      return (
                        <div key={enrollment.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{enrollment.courses?.name}</h4>
                              <p className="text-sm text-muted-foreground">{enrollment.courses?.description}</p>
                            </div>
                            <Badge variant="outline">{progress}%</Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            
                            {/* Lectures List */}
                            {courseLectures.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <h5 className="font-medium text-sm mb-3">Course Lectures</h5>
                                {courseLectures.map((lecture: any, index: number) => {
                                  const isCompleted = lecture.id === completedLectureId || 
                                    courseLectures.findIndex((l: any) => l.id === completedLectureId) > index;
                                  
                                  return (
                                    <div key={lecture.id} className="flex items-center gap-3 p-3 border rounded hover:bg-accent/50 transition-colors">
                                      <Checkbox
                                        checked={isCompleted}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            handleLectureComplete(lecture.id, enrollment.course_id);
                                          }
                                        }}
                                        disabled={isCompleted}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                                          {lecture.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(lecture.scheduled_at).toLocaleDateString()} at {new Date(lecture.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                      </div>
                                      {isCompleted ? (
                                        <CheckCircle2 className="text-primary shrink-0" size={18} />
                                      ) : (
                                        <Circle className="text-muted-foreground shrink-0" size={18} />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                              {enrollment.courses?.whatsapp_group_link && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(enrollment.courses.whatsapp_group_link, "_blank")}
                                >
                                  <MessageCircle className="mr-2" size={14} />
                                  Course Group
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="mx-auto mb-2 opacity-50" size={32} />
                    <p>No courses enrolled yet.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        const message = `Hi! I'm ${userData?.name} (Faculty ID: ${userData?.faculty_id}). I'd like to enroll in a course.`;
                        window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(message)}`, "_blank");
                      }}
                    >
                      Contact Us to Enroll
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const message = `Hi! I'm ${userData?.name} (Faculty ID: ${userData?.faculty_id}). I need assistance with my account.`;
                      window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(message)}`, "_blank");
                    }}
                  >
                    <MessageCircle className="mr-2" size={18} />
                    Contact Support
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://chat.whatsapp.com/GCnw88T0nxs5oabYgcqXKt", "_blank")}
                  >
                    <Users className="mr-2" size={18} />
                    Community Hub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Forgot ID Dialog */}
        <Dialog open={showForgotIdDialog} onOpenChange={setShowForgotIdDialog}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Recover Your Faculty ID</DialogTitle>
              <DialogDescription>
                Provide your email and phone number. We'll verify your information and send your Faculty ID via WhatsApp.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email Address *</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={forgotIdData.email}
                  onChange={(e) => setForgotIdData({ ...forgotIdData, email: e.target.value })}
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="forgot-phone">Phone Number *</Label>
                <Input
                  id="forgot-phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={forgotIdData.phone}
                  onChange={(e) => setForgotIdData({ ...forgotIdData, phone: e.target.value })}
                  maxLength={20}
                />
              </div>

              <Button
                onClick={handleForgotIdSubmit}
                className="w-full bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90"
                size="lg"
              >
                <MessageCircle className="mr-2" size={18} />
                Send Recovery Request
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