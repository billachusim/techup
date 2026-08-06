import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import JoinWhatsAppButton from "@/components/JoinWhatsAppButton";
import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Calendar, Users, BookOpen, ExternalLink, MessageCircle, CheckCircle2, Circle, FileText, BadgeCheck, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";
import { HandoutModal } from "@/components/HandoutModal";
import { CertificateCard } from "@/components/CertificateCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import techFacultyLogo from "@/assets/tech-faculty-logo.png";
import googleLogo from "@/assets/partners/google-logo.png";
import microsoftLogo from "@/assets/partners/microsoft-logo.png";
import fmstiLogo from "@/assets/partners/fmsti-logo.png";

const Dashboard = () => {
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [lecturesData, setLecturesData] = useState<any[]>([]);
  const [nextLecture, setNextLecture] = useState<any>(null);
  const [nextClassNumber, setNextClassNumber] = useState<number>(1);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [handoutModalOpen, setHandoutModalOpen] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<any>(null);
  const [isLoadingAiContent, setIsLoadingAiContent] = useState(false);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isRefreshingContent, setIsRefreshingContent] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, userData, logout, setUserData, facultyId } = useUser();
  const navigate = useNavigate();

  const fetchUserDashboardData = async (facultyIdToFetch: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('faculty_id', facultyIdToFetch)
        .single();

      if (profileError) throw profileError;

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('faculty_id', facultyIdToFetch)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setEnrollmentData(enrollment);

      const planMapping: { [key: string]: string } = {
        "Free Bootcamp": "free_bootcamp",
        "Bootcamp Starter": "bootcamp_starter",
        "Developer Pro": "developer_pro",
        "Data Wizard": "data_wizard",
        "Security Shield": "security_shield",
        "AI Innovator": "ai_innovator",
        "Cloud Architect": "cloud_architect",
        "Design Master": "design_master",
        "Digital Marketing Pro": "digital_marketing_pro",
      };

      const departmentMapping: { [key: string]: string } = {
        "Free Bootcamp": "General Tech",
        "Bootcamp Starter": "General Tech",
        "Developer Pro": "Web Development",
        "Data Wizard": "Data Science",
        "Security Shield": "Cyber Security",
        "AI Innovator": "Machine Learning",
        "Cloud Architect": "Cloud Computing",
        "Design Master": "UI/UX Design",
        "Digital Marketing Pro": "Digital Marketing",
      };

      const dbPlanName = planMapping[enrollment?.plan_name || ""] || "free_bootcamp";
      const resolvedDepartment = profileData?.department || departmentMapping[enrollment?.plan_name || ""] || "General Tech";

      setUserData({
        ...profileData,
        department: resolvedDepartment,
      });

      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('plan_required', dbPlanName)
        .eq('department', resolvedDepartment);

      let courseEnrollments: any[] = [];
      try {
        const { data: userCourses, error: userCoursesError } = await supabase.functions.invoke('user-courses', {
          body: { facultyId: facultyIdToFetch }
        });
        if (userCoursesError) throw userCoursesError;

        courseEnrollments = userCourses?.enrollments || [];
        setCoursesData(courseEnrollments);

        try {
          const { data: refreshedProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('faculty_id', facultyIdToFetch)
            .single();
          if (refreshedProfile) {
            setUserData(refreshedProfile);
          }
        } catch (e) {
          console.warn('Could not refresh profile after syncing courses:', e);
        }
      } catch (fnErr) {
        console.error('Error fetching user courses via function:', fnErr);
        setCoursesData([]);
      }

      try {
        const { data: certs, error: certsError } = await supabase
          .from('certificates')
          .select('*')
          .eq('faculty_id', facultyIdToFetch)
          .order('issued_at', { ascending: false });
        if (!certsError && certs) setCertificates(certs);
      } catch (certErr) {
        console.error('Error fetching certificates:', certErr);
      }

      if (courseEnrollments && courseEnrollments.length > 0) {
        const courseIds = courseEnrollments.map((ce: any) => ce.course_id);
        const { data: allLectures } = await supabase
          .from('lectures')
          .select('*, courses (*)')
          .in('course_id', courseIds)
          .order('scheduled_at', { ascending: true });

        setLecturesData(allLectures || []);

        const { data: progressRecords } = await supabase
          .from('course_progress')
          .select('*')
          .eq('faculty_id', facultyIdToFetch);

        let nextLectureToShow = null;
        let calculatedNextClassNumber = 1;

        for (const enrollment of courseEnrollments) {
          const progress = enrollment.course_progress?.[0];
          const classesCompleted = progress?.classes_completed || 0;
          if (classesCompleted < 4) {
            const courseLectures = (allLectures || []).filter((l: any) => l.course_id === enrollment.course_id);
            const nextClassIndex = classesCompleted;
            nextLectureToShow = courseLectures[nextClassIndex] || courseLectures[0];
            calculatedNextClassNumber = classesCompleted + 1;
            if (nextLectureToShow) break;
          }
        }

        setNextLecture(nextLectureToShow);
        setNextClassNumber(calculatedNextClassNumber);

        if (nextLectureToShow && courseEnrollments.length > 0) {
          setIsLoadingAiContent(true);
          try {
            const enrollmentForCourse = courseEnrollments.find((ce: any) => ce.course_id === nextLectureToShow.course_id);
            const courseName = enrollmentForCourse?.courses?.name || nextLectureToShow.courses?.name || 'General Tech Course';
            const { data: aiContent, error: aiError } = await supabase.functions.invoke('generate-class-content', {
              body: { classTitle: nextLectureToShow.title, courseName, classNumber: calculatedNextClassNumber, courseId: nextLectureToShow.course_id, forceRefresh: false }
            });
            if (!aiError && aiContent) setAiGeneratedContent(aiContent);
          } catch (error) {
            console.error("Error generating AI content:", error);
          } finally {
            setIsLoadingAiContent(false);
          }
        }

        if (!allLectures || allLectures.length === 0) {
          const cacheKey = `aiNextClass_${facultyIdToFetch}`;
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            try {
              const parsed = JSON.parse(cachedData);
              if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                setNextLecture(parsed.lecture);
              } else {
                localStorage.removeItem(cacheKey);
              }
            } catch (e) { localStorage.removeItem(cacheKey); }
          }
          if (!cachedData || !nextLecture) {
            try {
              const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-next-class', { body: { courses: courseEnrollments } });
              if (aiError) throw aiError;
              if (aiData?.nextClass) {
                const daysAhead = Math.floor(Math.random() * 5) + 3;
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + daysAhead);
                const lecture = {
                  title: aiData.nextClass.title, description: aiData.nextClass.description,
                  scheduled_at: futureDate.toISOString(), duration_minutes: parseInt(aiData.nextClass.duration) || 90,
                  courses: { name: aiData.nextClass.course }, meeting_link: null, isAiGenerated: true,
                  classNumber: aiData.nextClass.classNumber || 1, resources: aiData.nextClass.resources || [],
                  handoutContent: aiData.nextClass.handoutContent || "", course_id: courseEnrollments[0]?.course_id
                };
                setNextLecture(lecture);
                if (courseEnrollments[0]?.course_progress?.[0]) {
                  setNextClassNumber(Math.min((courseEnrollments[0].course_progress[0].classes_completed || 0) + 1, 4));
                } else { setNextClassNumber(1); }
                localStorage.setItem(cacheKey, JSON.stringify({ lecture, timestamp: Date.now() }));
              }
            } catch (aiError) { console.error('Error generating next class with AI:', aiError); }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleSignOut = async () => {
    await logout();
    toast({ title: "Signed Out", description: "You've been signed out successfully." });
    navigate('/');
  };

  const handleCheckpointComplete = async (courseId: string, checkpointNumber: number) => {
    if (!userData?.faculty_id) return;
    try {
      const { data: progressData } = await supabase
        .from("course_progress").select("*")
        .eq("faculty_id", userData.faculty_id).eq("course_id", courseId).maybeSingle();

      const currentCompleted = progressData?.classes_completed || 0;
      let newClassesCompleted: number;
      if (checkpointNumber === currentCompleted) {
        newClassesCompleted = Math.max(0, currentCompleted - 1);
      } else if (checkpointNumber === currentCompleted + 1) {
        newClassesCompleted = checkpointNumber;
      } else {
        toast({ title: "Complete in Order", description: "Please complete classes in order.", variant: "destructive" });
        return;
      }

      const newProgress = newClassesCompleted * 25;
      if (progressData) {
        const { error } = await supabase.from("course_progress").update({
          classes_completed: newClassesCompleted, progress_percentage: newProgress,
          last_accessed: new Date().toISOString(),
          ...(newProgress === 100 ? { completed_at: new Date().toISOString() } : { completed_at: null })
        }).eq("id", progressData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("course_progress").insert({
          faculty_id: userData.faculty_id, course_id: courseId,
          classes_completed: newClassesCompleted, progress_percentage: newProgress,
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
      localStorage.removeItem(`aiNextClass_${userData.faculty_id}`);
      await fetchUserDashboardData(userData.faculty_id);
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({ title: "Error", description: "Failed to update progress. Please try again.", variant: "destructive" });
    }
  };

  const handleRefreshContent = async () => {
    if (!nextLecture?.course_id || !facultyId) return;
    setIsRefreshingContent(true);
    try {
      const courseName = nextLecture?.courses?.name || 'General Tech Course';
      const { data: aiContent, error: aiError } = await supabase.functions.invoke('generate-class-content', {
        body: { classTitle: nextLecture.title, courseName, classNumber: nextClassNumber, courseId: nextLecture.course_id, forceRefresh: true }
      });
      if (!aiError && aiContent) {
        setAiGeneratedContent(aiContent);
        toast({ title: "Content Refreshed", description: "Class content has been regenerated successfully." });
      } else { throw aiError; }
    } catch (error) {
      console.error("Error refreshing content:", error);
      toast({ title: "Refresh Failed", description: "Could not refresh content. Please try again.", variant: "destructive" });
    } finally { setIsRefreshingContent(false); }
  };

  useEffect(() => {
    if (isLoggedIn && facultyId) {
      fetchUserDashboardData(facultyId);
    }
  }, [isLoggedIn, facultyId]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto max-w-2xl py-24 px-4 text-center space-y-6">
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">Please log in to access your dashboard.</p>
            <Link to="/#get-started">
              <Button size="lg">Go to Login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard - Tech Faculty NG</title>
        <meta name="description" content="Access your Tech Faculty student dashboard. Track course progress, view upcoming classes, and manage your certifications." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="pt-20">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl space-y-6">
            {/* Header with Sign Out */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome Back, {userData?.name}!
                </h1>
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
              {/* Profile Certificate Card */}
              <Card className="bg-gradient-to-br from-card via-background to-card border-2 border-primary/20 shadow-xl">
                <CardContent className="p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                    <BadgeCheck size={300} className="text-primary" />
                  </div>
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary/30 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-primary/30 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-primary/30 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-primary/30 rounded-br-lg" />
                  <div className="flex justify-center pt-4">
                    <img src={techFacultyLogo} alt="Tech Faculty" className="h-16 w-auto object-contain" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-[hsl(170,100%,47%)] to-[hsl(180,100%,45%)] bg-clip-text text-transparent">Student Profile</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Tech Faculty NG</p>
                  </div>
                  <div className="space-y-4 py-4">
                    <div className="text-center border-b border-border/50 pb-2">
                      <p className="text-2xl font-bold text-foreground">{userData?.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">Student Name</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="border-r border-border/50">
                        <p className="font-mono text-sm font-semibold text-primary">{userData?.faculty_id}</p>
                        <p className="text-xs text-muted-foreground mt-1">Faculty ID</p>
                      </div>
                      <div>
                        <Badge variant={enrollmentData?.plan_name === "Developer Pro" ? "default" : "secondary"} className="text-xs">
                          {enrollmentData?.plan_name || "Free Bootcamp"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Plan</p>
                      </div>
                    </div>
                    <div className="text-center border-t border-border/50 pt-4 space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="font-medium text-sm">{userData?.department || "Not assigned"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs text-center text-muted-foreground mb-3 uppercase tracking-wide">In Partnership With</p>
                    <div className="flex justify-center items-center gap-4 flex-wrap">
                      <img src={googleLogo} alt="Google" className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
                      <img src={microsoftLogo} alt="Microsoft" className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
                      <img src={fmstiLogo} alt="Federal Ministry of Science Technology and Innovation" className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Lecture Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Calendar className="text-primary" size={20} />
                      Next Class
                    </h3>
                    <Badge variant="outline" className="text-sm">Class {nextClassNumber} of 4</Badge>
                  </div>
                  {nextLecture ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{(aiGeneratedContent?.title || nextLecture.title).replace(/\s*-?\s*(Session|Class)\s+\d+/gi, '')}</h4>
                          <Badge variant="secondary" className="ml-2"><BadgeCheck className="mr-1" size={14} />AI Course Rep</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{nextLecture.courses?.name}</p>
                        {isLoadingAiContent ? (
                          <p className="text-sm text-muted-foreground mt-2 italic">Loading class summary...</p>
                        ) : aiGeneratedContent?.summary ? (
                          <p className="text-sm text-muted-foreground mt-2">{aiGeneratedContent.summary}</p>
                        ) : aiGeneratedContent?.description ? (
                          <p className="text-sm text-muted-foreground mt-2">{(aiGeneratedContent.description.split(/(?<=[.!?])\s+/).slice(0,2).join(' ') + (aiGeneratedContent.description.match(/[.!?]$/) ? '' : '.'))}</p>
                        ) : nextLecture.description ? (
                          <p className="text-sm text-muted-foreground mt-2">{nextLecture.description}</p>
                        ) : null}
                      </div>
                      <div className="text-sm">
                        <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{new Date(nextLecture.scheduled_at).toLocaleDateString()}</span></div>
                        {!nextLecture.isAiGenerated && (
                          <div><span className="text-muted-foreground">Time:</span> <span className="font-medium">{new Date(nextLecture.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                        )}
                      </div>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => setHandoutModalOpen(true)}>
                        <FileText className="mr-2" size={16} />View Class Handout
                      </Button>
                      <Button size="sm" variant="ghost" className="w-full" onClick={handleRefreshContent} disabled={isRefreshingContent}>
                        <RefreshCw className={`mr-2 ${isRefreshingContent ? 'animate-spin' : ''}`} size={16} />
                        {isRefreshingContent ? 'Refreshing...' : 'Refresh Content'}
                      </Button>
                      {nextLecture.meeting_link && !nextLecture.isAiGenerated && (
                        <Button size="sm" className="w-full" onClick={() => window.open(nextLecture.meeting_link, "_blank")}>
                          Join Class<ExternalLink className="ml-2" size={16} />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="w-full" onClick={() => {
                        const message = `Hi! I'm ready for the next class: ${nextLecture.title} (${nextLecture.courses?.name})`;
                        window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(message)}`, "_blank");
                      }}>
                        Join Live Class
                      </Button>
                      {nextLecture.courses?.whatsapp_group_link && !nextLecture.isAiGenerated && (
                        <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(nextLecture.courses.whatsapp_group_link, "_blank")}>
                          <MessageCircle className="mr-2" size={16} />Class WhatsApp Group
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
                  <BookOpen className="text-primary" size={20} />Your Courses
                </h3>
                {coursesData.length > 0 ? (
                  <div className="space-y-6">
                    {(showAllCourses ? coursesData : coursesData.slice(0, 3)).map((enrollment: any, index: number) => {
                      const progress = enrollment.course_progress?.[0];
                      const classesCompleted = progress?.classes_completed || 0;
                      const progressPercentage = classesCompleted * 25;
                      const allCoursesToDisplay = showAllCourses ? coursesData : coursesData.slice(0, 3);
                      const isPreviousCourseIncomplete = index > 0 && allCoursesToDisplay.slice(0, index).some((prev: any) => {
                        const prevCompleted = prev.course_progress?.[0]?.classes_completed || 0;
                        return prevCompleted < 4;
                      });
                      const isCourseActive = !isPreviousCourseIncomplete;

                      return (
                        <div key={enrollment.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{enrollment.courses?.name}</h4>
                              <p className="text-sm text-muted-foreground">{enrollment.courses?.description}</p>
                            </div>
                            <Badge variant={classesCompleted === 4 ? "default" : "outline"}>{classesCompleted}/4 Classes</Badge>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs text-muted-foreground min-w-fit">Mark class:</span>
                              <div className="flex gap-2 flex-1">
                                {[1, 2, 3, 4].map((checkpoint) => {
                                  const isCompleted = classesCompleted >= checkpoint;
                                  const isNext = checkpoint === classesCompleted + 1;
                                  const isCurrentLast = checkpoint === classesCompleted;
                                  const canInteract = isCourseActive && (isNext || isCurrentLast);
                                  return (
                                    <button
                                      key={checkpoint}
                                      onClick={() => canInteract && handleCheckpointComplete(enrollment.course_id, checkpoint)}
                                      disabled={!canInteract}
                                      className={`flex-1 h-8 rounded-md border-2 transition-all flex items-center justify-center ${
                                        !isCourseActive ? "bg-background border-muted-foreground/20 cursor-not-allowed opacity-40"
                                          : isCompleted ? "bg-primary border-primary text-primary-foreground"
                                          : isNext ? "bg-background border-primary/50 hover:border-primary hover:bg-primary/5 cursor-pointer"
                                          : "bg-background border-muted-foreground/20 cursor-not-allowed opacity-50"
                                      } ${isCourseActive && isCurrentLast && isCompleted ? "cursor-pointer hover:opacity-80" : ""}`}
                                      title={!isCourseActive ? "Complete previous course first" : isCurrentLast && isCompleted ? "Click to undo" : isNext ? "Click to complete" : isCompleted ? "Completed" : "Complete previous classes first"}
                                    >
                                      <span className="text-xs font-medium">{checkpoint}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            {!isCourseActive && (
                              <p className="text-xs text-muted-foreground italic pt-2">Complete the previous course to unlock this one</p>
                            )}
                            <div className="flex gap-2 pt-2">
                              {enrollment.courses?.whatsapp_group_link && (
                                <Button variant="outline" size="sm" onClick={() => window.open(enrollment.courses.whatsapp_group_link, "_blank")}>
                                  <MessageCircle className="mr-2" size={14} />Course Group
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {coursesData.length > 3 && (
                      <div className="flex justify-center pt-2">
                        <Button variant="outline" onClick={() => setShowAllCourses(!showAllCourses)}>
                          {showAllCourses ? "See Less Courses" : `See More Courses (${coursesData.length - 3} more)`}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="mx-auto mb-2 opacity-50" size={32} />
                    <p>No courses enrolled yet.</p>
                    <Link to="/#pricing">
                      <Button variant="outline" size="sm" className="mt-4">Choose Your Plan</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certificates */}
            {certificates.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BadgeCheck className="text-primary" size={20} />Your Certificates
                  </h3>
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <CertificateCard key={cert.id} certificate={cert} studentName={userData?.name || ''} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => {
                    const message = `Hi! I'm ${userData?.name} (Faculty ID: ${userData?.faculty_id}). I need assistance with my account.`;
                    window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(message)}`, "_blank");
                  }}>
                    <MessageCircle className="mr-2" size={18} />Contact Support
                  </Button>
                  <JoinWhatsAppButton
                    variant="outline"
                    url={COMMUNITY_WHATSAPP_URL}
                    groupName="the Tech Faculty WhatsApp community"
                  >
                    <span className="flex items-center justify-center">
                      <Users className="mr-2" size={18} />Community Hub
                    </span>
                  </JoinWhatsAppButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />

      <HandoutModal
        open={handoutModalOpen}
        onOpenChange={setHandoutModalOpen}
        classTitle={(aiGeneratedContent?.title || nextLecture?.title || '').replace(/\s*-?\s*(Session|Class)\s+\d+/gi, '')}
        classNumber={nextClassNumber}
        course={nextLecture?.courses?.name || ''}
        resources={aiGeneratedContent?.resources || []}
        handoutContent={aiGeneratedContent?.handoutContent || 'No handout content available yet. Check back later or contact your instructor.'}
        description={aiGeneratedContent?.description || nextLecture?.description}
      />
    </div>
  );
};

export default Dashboard;
