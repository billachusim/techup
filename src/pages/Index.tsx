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
        <meta name="description" content="Tech Faculty NG is an accredited technology training institute in Nnewi, Anambra State. Learn Software Engineering, Data Science, Cyber Security, AI & more. We train, certify, and employ you!" />
        <meta property="og:title" content="Tech Faculty NG - Get Trained, Certified & Employed" />
        <meta property="og:description" content="Accredited tech training institute in Nigeria. Learn Software Engineering, Data Science, Cyber Security, AI & more. International certifications and job placement." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/" />
        <link rel="canonical" href="https://techfaculty.ng/" />
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
