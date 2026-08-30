import { Helmet } from "react-helmet-async";
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

const provider = { "@type": "Organization", "name": "Tech Faculty", "url": "https://techfaculty.ng" };

const courses = [
  {
    position: 1,
    name: "Data Analytics & Data Science",
    description: "12-week intensive bootcamp covering Python, SQL, Power BI, and machine learning fundamentals. 87% graduate employment rate.",
    prerequisites: "Basic computer literacy",
    duration: "P12W",
    occupation: "Data Analyst",
    price: "150000",
  },
  {
    position: 2,
    name: "Web Development",
    description: "Full-stack web development bootcamp covering HTML, CSS, JavaScript, React, and Node.js with real-world projects.",
    prerequisites: "Basic computer literacy",
    duration: "P12W",
    occupation: "Full-Stack Developer",
    price: "150000",
  },
  {
    position: 3,
    name: "Cybersecurity",
    description: "Hands-on cybersecurity training covering network security, ethical hacking, and compliance frameworks.",
    prerequisites: "Basic networking knowledge",
    duration: "P12W",
    occupation: "Cybersecurity Analyst",
    price: "180000",
  },
  {
    position: 4,
    name: "Artificial Intelligence & Machine Learning",
    description: "Advanced AI/ML bootcamp with TensorFlow, PyTorch, and real-world deployment projects.",
    prerequisites: "Basic Python programming",
    duration: "P16W",
    occupation: "AI/ML Engineer",
    price: "200000",
  },
  {
    position: 5,
    name: "Digital Marketing",
    description: "Comprehensive digital marketing course covering SEO, social media, Google Ads, and analytics.",
    prerequisites: "None",
    duration: "P8W",
    occupation: "Digital Marketing Specialist",
    price: "100000",
  },
];

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Tech Faculty Courses",
  "description": "Accredited technology bootcamp courses offered by Tech Faculty in Africa",
  "itemListElement": courses.map((c) => ({
    "@type": "ListItem",
    "position": c.position,
    "item": {
      "@type": "Course",
      "name": c.name,
      "description": c.description,
      "provider": provider,
      "coursePrerequisites": c.prerequisites,
      "timeRequired": c.duration,
      "occupationalCategory": c.occupation,
      "inLanguage": "en",
      "offers": {
        "@type": "Offer",
        "price": c.price,
        "priceCurrency": "NGN",
        "availability": "https://schema.org/InStock",
        "url": "https://techfaculty.ng/#pricing"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "blended",
        "courseWorkload": c.duration
      }
    }
  }))
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tech Faculty — Get Certified & Employed in Tech</title>
        <meta name="description" content="Accredited bootcamps in software engineering, data science, AI and cybersecurity. 6,000+ students trained, 87% employed. Learn in person or online." />
        <meta property="og:title" content="Tech Faculty — World-Class Tech Training" />
        <meta property="og:description" content="Over 6,000 students trained. 87% employment rate. Accredited bootcamps in Software Engineering, Data Science, Cybersecurity & AI. Training professionals worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/" />
        <link rel="canonical" href="https://techfaculty.ng/" />
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
      </Helmet>
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
