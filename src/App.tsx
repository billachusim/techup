import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
import { UserProvider } from "@/contexts/UserContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Index from "./pages/Index";
import TechStore from "./pages/TechStore";
import BusinessPartnerships from "./pages/BusinessPartnerships";
import SchoolCollaborations from "./pages/SchoolCollaborations";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import SIWES from "./pages/SIWES";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import Careers from "./pages/Careers";
import JobDetail from "./pages/JobDetail";
import Dashboard from "./pages/Dashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import Products from "./pages/Products";
import Verify from "./pages/Verify";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import DepartmentsIndex from "./pages/DepartmentsIndex";
import DepartmentDetail from "./pages/DepartmentDetail";
import TinyPeople from "./pages/TinyPeople";
import LovablePage from "./pages/Lovable";
import AdminCertificates from "./pages/AdminCertificates";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import OAuthConsent from "./pages/OAuthConsent";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tech-store" element={<TechStore />} />
            <Route path="/business-partnerships" element={<BusinessPartnerships />} />
            <Route path="/school-collaborations" element={<SchoolCollaborations />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/siwes" element={<SIWES />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/category/:slug" element={<BlogCategory />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/jobs/:slug" element={<JobDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/products" element={<Products />} />
            <Route path="/verify/*" element={<Verify />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:slug" element={<LocationDetail />} />
            <Route path="/departments" element={<DepartmentsIndex />} />
            <Route path="/departments/:slug" element={<DepartmentDetail />} />
            <Route path="/tinypeople" element={<TinyPeople />} />
            <Route path="/lovable" element={<LovablePage />} />
            <Route path="/admin/certificates" element={<AdminCertificates />} />
            <Route path="/login" element={<Login />} />
            <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
            {/* Legacy WordPress redirects */}
            <Route path="/category/*" element={<Navigate to="/blog" replace />} />
            <Route path="/tag/*" element={<Navigate to="/blog" replace />} />
            <Route path="/tech" element={<Navigate to="/" replace />} />
            <Route path="/why-90-of-tech-learners-quit-but-you-dont-have-to" element={<Navigate to="/blog" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </CurrencyProvider>
    </UserProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
