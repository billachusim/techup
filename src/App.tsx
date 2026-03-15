import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import TechStore from "./pages/TechStore";
import BusinessPartnerships from "./pages/BusinessPartnerships";
import SchoolCollaborations from "./pages/SchoolCollaborations";
import Events from "./pages/Events";
import SIWES from "./pages/SIWES";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tech-store" element={<TechStore />} />
            <Route path="/business-partnerships" element={<BusinessPartnerships />} />
            <Route path="/school-collaborations" element={<SchoolCollaborations />} />
            <Route path="/events" element={<Events />} />
            <Route path="/siwes" element={<SIWES />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
