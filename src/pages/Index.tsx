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
