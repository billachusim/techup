import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Departments from "@/components/Departments";
import Companies from "@/components/Companies";
import Testimonials from "@/components/Testimonials";
import Clarity from "@/components/Clarity";
import FacultyDiscount from "@/components/FacultyDiscount";
import ServicesSection from "@/components/ServicesSection";
import Pricing from "@/components/Pricing";
import GetStarted from "@/components/GetStarted";
import Footer from "@/components/Footer";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const { isLoggedIn } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tech Faculty NG - Get Trained, Certified & Employed</title>
        <meta name="description" content="Tech Faculty NG is an accredited technology training institute in Nnewi, Anambra State. Learn Software Engineering, Data Science, Cyber Security, AI & more. Licensed by FMSTI via NBTI. We train, certify, and employ you!" />
        <meta property="og:title" content="Tech Faculty NG - Get Trained, Certified & Employed" />
        <meta property="og:description" content="Accredited tech training institute in Nigeria. Learn Software Engineering, Data Science, Cyber Security, AI & more. International certifications and job placement." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/" />
        <link rel="canonical" href="https://techfaculty.ng/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Tech Faculty NG Courses",
          "description": "Technology bootcamp courses offered by Tech Faculty NG",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "item": { "@type": "Course", "name": "Data Analytics & Data Science", "provider": { "@type": "Organization", "name": "Tech Faculty NG" }, "description": "Learn data analytics and data science with hands-on projects" } },
            { "@type": "ListItem", "position": 2, "item": { "@type": "Course", "name": "Web Development", "provider": { "@type": "Organization", "name": "Tech Faculty NG" }, "description": "Full-stack web development bootcamp" } },
            { "@type": "ListItem", "position": 3, "item": { "@type": "Course", "name": "Cybersecurity", "provider": { "@type": "Organization", "name": "Tech Faculty NG" }, "description": "Cybersecurity training and certification" } },
            { "@type": "ListItem", "position": 4, "item": { "@type": "Course", "name": "Artificial Intelligence & Machine Learning", "provider": { "@type": "Organization", "name": "Tech Faculty NG" }, "description": "AI and ML bootcamp with real-world applications" } },
            { "@type": "ListItem", "position": 5, "item": { "@type": "Course", "name": "Digital Marketing", "provider": { "@type": "Organization", "name": "Tech Faculty NG" }, "description": "Digital marketing strategies and tools" } }
          ]
        })}</script>
      </Helmet>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Departments />
        <Companies />
        <ServicesSection />
        <Testimonials />
        <Clarity />
        <FacultyDiscount />
        <Pricing />
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
