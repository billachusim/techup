import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LogOut, Calendar, Users, BookOpen, ExternalLink, MessageCircle, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignupForm } from "@/components/Auth/SignupForm";
import { LoginForm } from "@/components/Auth/LoginForm";

const GetStarted = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showForgotIdDialog, setShowForgotIdDialog] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [lecturesData, setLecturesData] = useState<any[]>([]);
  const [nextLecture, setNextLecture] = useState<any>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [forgotIdData, setForgotIdData] = useState({
    email: "",
    phone: "",
  });
  const { toast } = useToast();
  const { isLoggedIn, userData, logout, setUserData, facultyId } = useUser();

  const handleSignupSuccess = async () => {
    // Sign out the user after signup so they need to enter Faculty ID
    await supabase.auth.signOut();
    setActiveTab("login");
  };

  const fetchUserDashboardData = async (facultyIdToFetch: string) => {
    try {
      // Fetch user data from profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('faculty_id', facultyIdToFetch)
        .single();

      if (profileError) throw profileError;

      // Fetch enrollment data
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('faculty_id', facultyIdToFetch)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setEnrollmentData(enrollment);

      // Map plan names to database format and departments
      const planMapping: { [key: string]: string } = {
        "Free Bootcamp": "free_bootcamp",
        "Bootcamp Starter": "bootcamp_starter",
        "Developer Pro": "developer_pro",
        "Data Wizard": "data_wizard",
      };

      const departmentMapping: { [key: string]: string } = {
        "Developer Pro": "Web Development",
        "Data Wizard": "Data Science",
        "Bootcamp Starter": "General Tech",
        "Free Bootcamp": "General Tech",
      };

      const dbPlanName = planMapping[enrollment?.plan_name] || "free_bootcamp";
      const userDepartment = departmentMapping[enrollment?.plan_name] || "General Tech";

      // Update profile with department
      setUserData({
        ...profileData,
        department: userDepartment
      });

      // Fetch courses filtered by plan
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('plan_required', dbPlanName)
        .eq('department', userDepartment);

      const coursesAvailable = courses || [];
      console.log('Courses available for plan:', { dbPlanName, userDepartment, coursesAvailable });

      // Auto-enroll handled by backend function

      // Sync and fetch enrollments via backend (bypasses RLS safely)
      let courseEnrollments: any[] = [];
      try {
        const { data: userCourses, error: userCoursesError } = await supabase.functions.invoke('user-courses', {
          body: { facultyId: facultyIdToFetch }
        });
        if (userCoursesError) throw userCoursesError;

        courseEnrollments = userCourses?.enrollments || [];
        console.log('User courses from function:', userCourses);
        setCoursesData(courseEnrollments);
      } catch (fnErr) {
        console.error('Error fetching user courses via function:', fnErr);
        setCoursesData([]);
      }

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

        // If no lectures exist in database, generate one using AI or use cached
        if (!allLectures || allLectures.length === 0) {
          // Check for cached AI suggestion
          const cacheKey = `aiNextClass_${facultyIdToFetch}`;
          const cachedData = localStorage.getItem(cacheKey);
          
          if (cachedData) {
            try {
              const parsed = JSON.parse(cachedData);
              // Check if cache is still valid (within 24 hours)
              const cacheAge = Date.now() - parsed.timestamp;
              if (cacheAge < 24 * 60 * 60 * 1000) {
                setNextLecture(parsed.lecture);
                console.log('Using cached AI suggestion');
              } else {
                localStorage.removeItem(cacheKey);
              }
            } catch (e) {
              console.error('Error parsing cached AI data:', e);
              localStorage.removeItem(cacheKey);
            }
          }
          
          // If no valid cache, generate new suggestion
          if (!cachedData || !nextLecture) {
            try {
              const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-next-class', {
                body: { courses: courseEnrollments }
              });

              if (aiError) throw aiError;

              if (aiData?.nextClass) {
                // Generate a future date (3-7 days ahead)
                const daysAhead = Math.floor(Math.random() * 5) + 3;
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + daysAhead);
                
                const lecture = {
                  title: aiData.nextClass.title,
                  description: aiData.nextClass.description,
                  scheduled_at: futureDate.toISOString(),
                  duration_minutes: parseInt(aiData.nextClass.duration) || 90,
                  courses: {
                    name: aiData.nextClass.course
                  },
                  meeting_link: null,
                  isAiGenerated: true
                };
                
                setNextLecture(lecture);
                
                // Cache the suggestion
                localStorage.setItem(cacheKey, JSON.stringify({
                  lecture,
                  timestamp: Date.now()
                }));
                console.log('Generated and cached new AI suggestion');
              }
            } catch (aiError) {
              console.error('Error generating next class with AI:', aiError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setEnrollmentData(null);
    setCoursesData([]);
    setLecturesData([]);
    setNextLecture(null);
    
    toast({
      title: "Signed Out",
      description: "You've been signed out successfully.",
    });
  };

  // Handle class checkpoint completion with undo support
  const handleCheckpointComplete = async (courseId: string, checkpointNumber: number) => {
    if (!userData?.faculty_id) return;

    try {
      // Get current progress for this course
      const { data: progressData } = await supabase
        .from("course_progress")
        .select("*")
        .eq("faculty_id", userData.faculty_id)
        .eq("course_id", courseId)
        .maybeSingle();

      const currentCompleted = progressData?.classes_completed || 0;
      
      // Allow clicking the same checkpoint to undo, or the next one to progress
      let newClassesCompleted: number;
      if (checkpointNumber === currentCompleted) {
        // Undo: go back one checkpoint
        newClassesCompleted = Math.max(0, currentCompleted - 1);
      } else if (checkpointNumber === currentCompleted + 1) {
        // Progress to next checkpoint
        newClassesCompleted = checkpointNumber;
      } else {
        // Don't allow skipping checkpoints
        toast({
          title: "Complete in Order",
          description: "Please complete classes in order.",
          variant: "destructive",
        });
        return;
      }

      const newProgress = newClassesCompleted * 25;

      if (progressData) {
        const { error } = await supabase
          .from("course_progress")
          .update({ 
            classes_completed: newClassesCompleted,
            progress_percentage: newProgress,
            last_accessed: new Date().toISOString(),
            ...(newProgress === 100 ? { completed_at: new Date().toISOString() } : { completed_at: null })
          })
          .eq("id", progressData.id);

        if (error) throw error;
      } else {
        // Create new progress record
        const { error } = await supabase
          .from("course_progress")
          .insert({
            faculty_id: userData.faculty_id,
            course_id: courseId,
            classes_completed: newClassesCompleted,
            progress_percentage: newProgress,
            last_accessed: new Date().toISOString()
          });

        if (error) throw error;
      }

      toast({
        title: "Progress Updated",
        description: newClassesCompleted > currentCompleted 
          ? `Class ${newClassesCompleted} of 4 completed!`
          : `Progress reset to ${newClassesCompleted} of 4 classes`,
      });
      
      // Refresh dashboard data
      await fetchUserDashboardData(userData.faculty_id);
    } catch (error) {
      console.error("Error updating progress:", error);
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

  useEffect(() => {
    if (isLoggedIn && facultyId) {
      fetchUserDashboardData(facultyId);
    }
  }, [isLoggedIn, facultyId]);

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

            <Card className="bg-card border-border max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "login" | "signup")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="mt-6">
                    <LoginForm 
                      onSuccess={() => {
                        toast({
                          title: "Welcome Back!",
                          description: "You've been logged in successfully.",
                        });
                      }}
                      onForgotPassword={() => setShowForgotIdDialog(true)}
                    />
                  </TabsContent>
                  <TabsContent value="signup" className="mt-6">
                    <SignupForm onSuccess={handleSignupSuccess} />
                  </TabsContent>
                </Tabs>
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
                        window.open(`https://chat.whatsapp.com/D8kuxWVZRTKKeAx6ERjSqc?text=${encodeURIComponent(message)}`, "_blank");
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
                        {nextLecture.description && (
                          <p className="text-sm text-muted-foreground mt-2">{nextLecture.description}</p>
                        )}
                        {nextLecture.isAiGenerated && (
                          <Badge variant="secondary" className="mt-2">AI Course Rep</Badge>
                        )}
                      </div>
                      <div className="text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>{" "}
                          <span className="font-medium">
                            {new Date(nextLecture.scheduled_at).toLocaleDateString()}
                          </span>
                        </div>
                        {!nextLecture.isAiGenerated && (
                          <div>
                            <span className="text-muted-foreground">Time:</span>{" "}
                            <span className="font-medium">
                              {new Date(nextLecture.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                      {nextLecture.meeting_link && !nextLecture.isAiGenerated && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(nextLecture.meeting_link, "_blank")}
                        >
                          Join Class
                          <ExternalLink className="ml-2" size={16} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const message = `Hi! I'm ready for the next class: ${nextLecture.title} (${nextLecture.courses?.name})`;
                          window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(message)}`, "_blank");
                        }}
                      >
                        Join Live Class
                      </Button>
                      {nextLecture.courses?.whatsapp_group_link && !nextLecture.isAiGenerated && (
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
                    {(showAllCourses ? coursesData : coursesData.slice(0, 3)).map((enrollment: any) => {
                      const progress = enrollment.course_progress?.[0];
                      const classesCompleted = progress?.classes_completed || 0;
                      const progressPercentage = classesCompleted * 25;
                      
                      return (
                        <div key={enrollment.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{enrollment.courses?.name}</h4>
                              <p className="text-sm text-muted-foreground">{enrollment.courses?.description}</p>
                            </div>
                            <Badge variant={classesCompleted === 4 ? "default" : "outline"}>
                              {classesCompleted}/4 Classes
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                            
                            {/* Checkpoint Markers */}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs text-muted-foreground min-w-fit">Mark class:</span>
                              <div className="flex gap-2 flex-1">
                                {[1, 2, 3, 4].map((checkpoint) => {
                                  const isCompleted = classesCompleted >= checkpoint;
                                  const isNext = checkpoint === classesCompleted + 1;
                                  const isCurrentLast = checkpoint === classesCompleted;
                                  const canInteract = isNext || isCurrentLast;
                                  
                                  return (
                                    <button
                                      key={checkpoint}
                                      onClick={() => handleCheckpointComplete(enrollment.course_id, checkpoint)}
                                      disabled={!canInteract}
                                      className={`flex-1 h-8 rounded-md border-2 transition-all flex items-center justify-center ${
                                        isCompleted
                                          ? "bg-primary border-primary text-primary-foreground"
                                          : isNext
                                          ? "bg-background border-primary/50 hover:border-primary hover:bg-primary/5 cursor-pointer"
                                          : "bg-background border-muted-foreground/20 cursor-not-allowed opacity-50"
                                      } ${isCurrentLast && isCompleted ? "cursor-pointer hover:opacity-80" : ""}`}
                                      title={
                                        isCurrentLast && isCompleted 
                                          ? "Click to undo" 
                                          : isNext 
                                          ? "Click to complete" 
                                          : isCompleted 
                                          ? "Completed" 
                                          : "Complete previous classes first"
                                      }
                                    >
                                      <span className="text-xs font-medium">{checkpoint}</span>
                                    </button>
                                  );
                                 })}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2">{enrollment.courses?.whatsapp_group_link && (
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
                    
                    {coursesData.length > 3 && (
                      <div className="flex justify-center pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowAllCourses(!showAllCourses)}
                        >
                          {showAllCourses ? "See Less Courses" : `See More Courses (${coursesData.length - 3} more)`}
                        </Button>
                      </div>
                    )}
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
                        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Choose Your Plan
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
                    onClick={() => window.open("https://chat.whatsapp.com/D8kuxWVZRTKKeAx6ERjSqc", "_blank")}
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
      </div>
    </section>
  );
};

export default GetStarted;