import { useState, useEffect } from "react";
import JoinWhatsAppButton from "@/components/JoinWhatsAppButton";
import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Lock, Calendar, Users, BookOpen, ExternalLink, MessageCircle, CheckCircle2, Circle, FileText, BadgeCheck, RefreshCw, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";
import { HandoutModal, type ClassPack } from "@/components/HandoutModal";
import { CertificateCard } from "@/components/CertificateCard";
import { StudentClassroom } from "@/components/student/StudentClassroom";
import { ReferralCard } from "@/components/student/ReferralCard";
import { BalanceDue } from "@/components/student/BalanceDue";
import { LocationPrompt } from "@/components/student/LocationPrompt";
import { isFreePlan } from "../../supabase/functions/_shared/enrollment-access.ts";

import { useServerFn } from "@tanstack/react-start";
import { briefNextClass, openClassVideos, getClassPack } from "@/lib/student-review.functions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "@/lib/router-compat";
import techFacultyLogo from "@/assets/tech-faculty-logo.png";
import googleLogo from "@/assets/partners/google-logo.png";
import microsoftLogo from "@/assets/partners/microsoft-logo.png";
import fmstiLogo from "@/assets/partners/fmsti-logo.png";

// whatsapp_group_link and meeting_link are read below but are not in the generated table types
type Course = Tables<"courses"> & { whatsapp_group_link?: string };
type Lecture = Tables<"lectures"> & { courses: Course | null; meeting_link?: string | null };

// Shape returned by the user-courses edge function
type CourseEnrollment = Tables<"course_enrollments"> & {
  courses: Course | null;
  course_progress: Tables<"course_progress">[];
  lectures: Tables<"lectures">[];
};

// A scheduled lecture, or a placeholder the AI generates when none is scheduled
type NextLecture = {
  title: string;
  description: string | null;
  scheduled_at: string;
  course_id?: string;
  courses?: Pick<Course, "name" | "whatsapp_group_link"> | null;
  meeting_link?: string | null;
  isAiGenerated?: boolean;
};

// Shape returned by the generate-class-content edge function
type ClassContent = {
  title?: string;
  summary?: string;
  description?: string;
  resources?: { type: string; title: string; url: string }[];
  handoutContent?: string;
  assignment?: string;
};

const Dashboard = () => {
  const [enrollmentData, setEnrollmentData] = useState<Tables<"enrollments"> | null>(null);
  const [coursesData, setCoursesData] = useState<CourseEnrollment[]>([]);
  const [lecturesData, setLecturesData] = useState<Lecture[]>([]);
  const [nextLecture, setNextLecture] = useState<NextLecture | null>(null);
  const [nextClassNumber, setNextClassNumber] = useState<number>(1);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [handoutModalOpen, setHandoutModalOpen] = useState(false);
  // The current class's videos/task/notes, and whichever class the handout shows.
  const [currentPack, setCurrentPack] = useState<ClassPack | null>(null);
  const [viewPack, setViewPack] = useState<ClassPack | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewLocked, setViewLocked] = useState(false);
  const [viewIsCurrent, setViewIsCurrent] = useState(true);
  const [startVideo, setStartVideo] = useState(0);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<ClassContent | null>(null);
  const [isLoadingAiContent, setIsLoadingAiContent] = useState(false);
  const [certificates, setCertificates] = useState<Tables<"certificates">[]>([]);
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

      let courseEnrollments: CourseEnrollment[] = [];
      try {
        const { data: userCourses, error: userCoursesError } = await supabase.functions.invoke('user-courses', {
          body: { facultyId: facultyIdToFetch }
        });
        if (userCoursesError) throw userCoursesError;

        // Show courses in the order students should take them
        courseEnrollments = [...(userCourses?.enrollments || [])].sort(
          (a: CourseEnrollment, b: CourseEnrollment) =>
            (a.courses?.sort_order ?? 100) - (b.courses?.sort_order ?? 100) ||
            (a.courses?.name ?? "").localeCompare(b.courses?.name ?? ""),
        );
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
        const courseIds = courseEnrollments.map((ce) => ce.course_id);
        const [{ data: allLectures }, { data: timetable }] = await Promise.all([
          supabase
            .from('lectures')
            .select('*, courses (*)')
            .in('course_id', courseIds),
          // Each student's own dates, counted from when they started
          supabase.rpc('student_timetable', { _faculty_id: facultyIdToFetch }),
        ]);
        const dateFor = new Map((timetable ?? []).map((t) => [t.lecture_id, t.scheduled_at]));
        const personal = (allLectures || [])
          .filter((l) => dateFor.has(l.id))
          .map((l) => ({ ...l, scheduled_at: dateFor.get(l.id)! }))
          .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));

        setLecturesData(personal);

        const { data: progressRecords } = await supabase
          .from('course_progress')
          .select('*')
          .eq('faculty_id', facultyIdToFetch);

        let nextLectureToShow: NextLecture | null = null;
        let calculatedNextClassNumber = 1;

        for (const enrollment of courseEnrollments) {
          const progress = enrollment.course_progress?.[0];
          const classesCompleted = progress?.classes_completed || 0;
          if (classesCompleted < 4) {
            const courseLectures = personal.filter((l) => l.course_id === enrollment.course_id);
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
            const enrollmentForCourse = courseEnrollments.find((ce) => ce.course_id === nextLectureToShow.course_id);
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

  // Once per class: brief the student's Slack class group and email them.
  const runBrief = useServerFn(briefNextClass);
  useEffect(() => {
    if (!nextLecture?.title || !facultyId) return;
    const title = String(nextLecture.title).replace(/\s*-?\s*(Session|Class)\s+\d+/gi, "").slice(0, 200) || "Your next class";
    const classKey = `${nextLecture.course_id ?? "general"}:${nextClassNumber}`;
    void runBrief({
      data: {
        classKey,
        classTitle: title,
        classNumber: nextClassNumber,
        date: nextLecture.scheduled_at ? new Date(nextLecture.scheduled_at).toDateString() : undefined,
        courseId: nextLecture.course_id || undefined,
        courseName: nextLecture.courses?.name || undefined,
      },
    }).catch(() => { /* best effort */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextLecture?.course_id, nextLecture?.title, nextClassNumber, facultyId]);

  // Give this student's Google account access to the Drive videos of the
  // classes they have reached (never a folder, never a later class).
  const runOpenVideos = useServerFn(openClassVideos);
  useEffect(() => {
    if (!nextLecture?.course_id || !facultyId) return;
    void runOpenVideos({ data: { courseId: nextLecture.course_id } }).catch(() => { /* best effort */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextLecture?.course_id, nextClassNumber, facultyId]);

  const runClassPack = useServerFn(getClassPack);
  useEffect(() => {
    if (!nextLecture?.course_id || !facultyId || nextLecture.isAiGenerated) { setCurrentPack(null); return; }
    let live = true;
    runClassPack({ data: { courseId: nextLecture.course_id, classNumber: nextClassNumber } })
      .then((r) => { if (live) setCurrentPack(r.locked ? null : r); })
      .catch(() => { /* best effort */ });
    return () => { live = false; };
    // Reload once the AI notes exist so the handout carries them
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextLecture?.course_id, nextClassNumber, facultyId, aiGeneratedContent?.handoutContent]);

  // The current class, filled from the freshly generated notes where the saved copy is missing
  const currentView: ClassPack | null = currentPack
    ? {
        ...currentPack,
        description: currentPack.description || aiGeneratedContent?.description || null,
        summary: currentPack.summary || aiGeneratedContent?.summary || null,
        handoutContent: currentPack.handoutContent || aiGeneratedContent?.handoutContent || null,
        task: currentPack.task || aiGeneratedContent?.assignment || null,
      }
    : null;

  const openCurrentClass = (videoIndex = 0) => {
    setStartVideo(videoIndex);
    setViewIsCurrent(true);
    setViewLocked(false);
    setViewPack(currentView);
    setViewLoading(!currentView);
    setHandoutModalOpen(true);
    if (!currentView && nextLecture?.course_id) {
      runClassPack({ data: { courseId: nextLecture.course_id, classNumber: nextClassNumber } })
        .then((r) => { if (r.locked) setViewLocked(true); else { setCurrentPack(r); setViewPack(r); } })
        .catch(() => setViewLocked(true))
        .finally(() => setViewLoading(false));
    }
  };

  // Past classes can be revised; the server refuses classes not yet reached.
  const openPastClass = (courseId: string, classNumber: number) => {
    setStartVideo(0);
    setViewIsCurrent(false);
    setViewLocked(false);
    setViewPack(null);
    setViewLoading(true);
    setHandoutModalOpen(true);
    runClassPack({ data: { courseId, classNumber } })
      .then((r) => { if (r.locked) setViewLocked(true); else setViewPack(r); })
      .catch(() => setViewLocked(true))
      .finally(() => setViewLoading(false));
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
    // Refetch only when the signed-in student changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <LocationPrompt />

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
                        {enrollmentData?.status === "pending" && !isFreePlan(enrollmentData.plan_name) && (
                          <p className="text-xs font-medium text-amber-600 mt-1">Awaiting payment</p>
                        )}
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

              {enrollmentData && <BalanceDue enrollment={enrollmentData} />}

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
                      {currentView && currentView.videos.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium flex items-center gap-1.5"><PlayCircle className="text-primary" size={16} />Class videos</p>
                          <ul className="space-y-1.5">
                            {currentView.videos.slice(0, 5).map((v, i) => (
                              <li key={v.url}>
                                <button type="button" onClick={() => openCurrentClass(i)} className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-left text-sm min-h-[44px] hover:bg-accent transition-colors">
                                  <PlayCircle className="text-primary shrink-0" size={16} />
                                  <span className="flex-1 min-w-0 break-words">{v.title}</span>
                                  <span className="shrink-0 text-xs font-medium text-link">Watch</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Button size="sm" variant="outline" className="w-full" onClick={() => openCurrentClass(0)}>
                        <FileText className="mr-2" size={16} />Open Class Handout & Videos
                      </Button>
                      <Button size="sm" variant="ghost" className="w-full" onClick={handleRefreshContent} disabled={isRefreshingContent}>
                        <RefreshCw className={`mr-2 ${isRefreshingContent ? 'animate-spin' : ''}`} size={16} />
                        {isRefreshingContent ? 'Refreshing...' : 'Refresh Content'}
                      </Button>
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

            {/* Class group (Slack, WhatsApp, live class) + weekly work submission */}
            <StudentClassroom
              facultyId={facultyId || userData?.faculty_id}
              department={userData?.department}
              courseName={nextLecture?.courses?.name}
              classNumber={nextClassNumber}
              courseId={nextLecture?.course_id ?? null}
              classTask={aiGeneratedContent?.assignment ?? null}
              classTitle={(aiGeneratedContent?.title || nextLecture?.title || '').replace(/\s*-?\s*(Session|Class)\s+\d+/gi, '')}
              meetingLink={nextLecture && !nextLecture.isAiGenerated ? nextLecture.meeting_link : null}
              whatsappGroupLink={nextLecture && !nextLecture.isAiGenerated ? nextLecture.courses?.whatsapp_group_link : null}
              liveClassMessage={nextLecture ? `Hi! I'm ready for the next class: ${nextLecture.title} (${nextLecture.courses?.name})` : null}
            />



            {/* Courses and Progress */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="text-primary" size={20} />Your Courses
                </h3>
                {coursesData.length > 0 ? (
                  <div className="space-y-6">
                    {(showAllCourses ? coursesData : coursesData.slice(0, 3)).map((enrollment, index) => {
                      const progress = enrollment.course_progress?.[0];
                      const classesCompleted = progress?.classes_completed || 0;
                      const progressPercentage = classesCompleted * 25;
                      const allCoursesToDisplay = showAllCourses ? coursesData : coursesData.slice(0, 3);
                      const isPreviousCourseIncomplete = index > 0 && allCoursesToDisplay.slice(0, index).some((prev) => {
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
                              <span className="text-xs text-muted-foreground min-w-fit">Classes:</span>
                              <div className="flex gap-2 flex-1">
                                {[1, 2, 3, 4].map((checkpoint) => {
                                  const isCompleted = classesCompleted >= checkpoint;
                                  const isNext = checkpoint === classesCompleted + 1;
                                  // Classes are marked done automatically when the task for them passes.
                                  return (
                                    <button
                                      type="button"
                                      key={checkpoint}
                                      disabled={!isCourseActive || !(isCompleted || isNext)}
                                      onClick={() => {
                                        if (isNext && enrollment.course_id === nextLecture?.course_id) openCurrentClass(0);
                                        else openPastClass(enrollment.course_id, checkpoint);
                                      }}
                                      className={`flex-1 h-8 rounded-md border-2 flex items-center justify-center gap-1 transition-colors disabled:cursor-not-allowed ${
                                        !isCourseActive ? "bg-background border-muted-foreground/20 opacity-40"
                                          : isCompleted ? "bg-primary border-primary text-primary-foreground hover:opacity-90"
                                          : isNext ? "bg-background border-primary/50 hover:bg-accent"
                                          : "bg-background border-muted-foreground/20 opacity-50"
                                      }`}
                                      aria-label={isCompleted ? `Revise class ${checkpoint}` : isNext ? `Open class ${checkpoint}` : `Class ${checkpoint} locked`}
                                      title={!isCourseActive ? "Finish the previous course first" : isCompleted ? "Done: tap to revise this class" : isNext ? "Current class: tap to open it" : "Locked until the class before it is done"}
                                    >
                                      {!isCompleted && !isNext && <Lock size={10} />}
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
                                <Button variant="outline" size="sm" onClick={() => window.open(enrollment.courses?.whatsapp_group_link, "_blank")}>
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

            <ReferralCard />

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
                    capture={false}
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
        pack={viewIsCurrent ? currentView ?? viewPack : viewPack}
        loading={viewLoading && !(viewIsCurrent && currentView)}
        locked={viewLocked}
        isCurrent={viewIsCurrent}
        startVideo={startVideo}
        scheduledAt={viewIsCurrent ? nextLecture?.scheduled_at : null}
        onSubmitTask={() => {
          setHandoutModalOpen(false);
          setTimeout(() => document.getElementById("work-link")?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
        }}
      />
    </div>
  );
};

export default Dashboard;
