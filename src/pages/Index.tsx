import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import FeaturedPrograms from "@/components/FeaturedPrograms";
import HowItWorks from "@/components/HowItWorks";
import Departments from "@/components/DepartmentsSection";
import LatestJobs from "@/components/LatestJobs";
import UpcomingEvents from "@/components/UpcomingEvents";
import Testimonials from "@/components/Testimonials";
import Clarity from "@/components/Clarity";
import FacultyDiscount from "@/components/FacultyDiscount";
import ServicesSection from "@/components/ServicesSection";
import Pricing from "@/components/Pricing";
import GetStarted from "@/components/GetStarted";
import Footer from "@/components/Footer";
import HomeWhatsAppPrompts from "@/components/HomeWhatsAppPrompts";
import { planMinimum } from "@/lib/fees";

const provider = { "@type": "Organization", "name": "Tech Faculty NG", "url": "https://techfaculty.ng" };

// Blended and onsite course instances must name where the in-person sessions happen.
const courseLocation = {
  "@type": "Place",
  "name": "Tech Faculty NG, Nnewi",
  "address": { "@type": "PostalAddress", "addressLocality": "Nnewi", "addressRegion": "Anambra State", "addressCountry": "NG" },
};

// Each course's offer price is its plan's lowest checkout amount, read from
// the same pricing table checkout charges.
const courses = [
  {
    position: 1,
    name: "Data Analytics & Data Science",
    slug: "data-science-analytics",
    description: "12-week intensive bootcamp covering Python, SQL, Power BI, and machine learning fundamentals. 75% graduate employment rate.",
    prerequisites: "Basic computer literacy",
    duration: "P12W",
    occupation: "Data Analyst",
    planId: "data-wizard",
  },
  {
    position: 2,
    name: "Web Development",
    slug: "web-development",
    description: "Full-stack web development bootcamp covering HTML, CSS, JavaScript, React, and Node.js with real-world projects.",
    prerequisites: "Basic computer literacy",
    duration: "P12W",
    occupation: "Full-Stack Developer",
    planId: "developer-pro",
  },
  {
    position: 3,
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Hands-on cybersecurity training covering network security, ethical hacking, and compliance frameworks.",
    prerequisites: "Basic networking knowledge",
    duration: "P12W",
    occupation: "Cybersecurity Analyst",
    planId: "security-shield",
  },
  {
    position: 4,
    name: "Artificial Intelligence & Machine Learning",
    slug: "ai-machine-learning",
    description: "Advanced AI/ML bootcamp with TensorFlow, PyTorch, and real-world deployment projects.",
    prerequisites: "Basic Python programming",
    duration: "P16W",
    occupation: "AI/ML Engineer",
    planId: "ai-innovator",
  },
  {
    position: 5,
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "Comprehensive digital marketing course covering SEO, social media, Google Ads, and analytics.",
    prerequisites: "None",
    duration: "P8W",
    occupation: "Digital Marketing Specialist",
    planId: "digital-marketing-pro",
  },
];

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Tech Faculty Courses",
  "description": "Technology bootcamp courses from Tech Faculty NG, licensed by FMSTI through NBTI",
  "itemListElement": courses.map((c) => ({
    "@type": "ListItem",
    "position": c.position,
    "item": {
      "@type": "Course",
      "name": c.name,
      "description": c.description,
      "url": `https://techfaculty.ng/departments/${c.slug}`,
      "provider": provider,
      "coursePrerequisites": c.prerequisites,
      "timeRequired": c.duration,
      "occupationalCategory": c.occupation,
      "inLanguage": "en",
      "offers": {
        "@type": "Offer",
        "price": String(planMinimum(c.planId)),
        "priceCurrency": "NGN",
        "availability": "https://schema.org/InStock",
        "category": "Paid",
        "url": "https://techfaculty.ng/#pricing"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Blended",
        "courseWorkload": c.duration,
        "location": courseLocation
      }
    }
  }))
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <>
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
      </>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <FeaturedPrograms />
        <HowItWorks />
        <Departments />
        <LatestJobs />
        <UpcomingEvents />
        <Testimonials />
        <ServicesSection />
        <Pricing />
        <Clarity />
        <FacultyDiscount />
        <GetStarted />
      </main>
      <Footer />
      <HomeWhatsAppPrompts />
    </div>
  );
};

export default Index;
