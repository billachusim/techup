import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/tech-faculty-logo.png";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCommunityDialog, setShowCommunityDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [facultyId, setFacultyId] = useState("");
  const { toast } = useToast();
  const { isLoggedIn, userData } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleCommunityClick = () => {
    // If user is logged in, go directly to community
    if (isLoggedIn && userData) {
      const message = `Hi! I'm ${userData.name} (Faculty ID: ${userData.faculty_id}). I'd like to join the Tech Faculty community.`;
      window.open(`https://chat.whatsapp.com/GCnw88T0nxs5oabYgcqXKt?text=${encodeURIComponent(message)}`, "_blank");
      toast({
        title: "Opening Community",
        description: "Welcome to the Tech Faculty community!",
      });
    } else {
      // If not logged in, show dialog to enter Faculty ID
      setShowCommunityDialog(true);
    }
  };

  const handleCommunityAccess = async () => {
    if (!facultyId.trim()) {
      toast({
        title: "Faculty ID Required",
        description: "Please enter your Faculty ID to access the community.",
        variant: "destructive",
      });
      return;
    }

    // Verify Faculty ID
    const { data: facultyData, error } = await supabase
      .from('faculty_ids')
      .select('*')
      .eq('faculty_id', facultyId.trim())
      .maybeSingle();

    if (error || !facultyData) {
      toast({
        title: "Invalid Faculty ID",
        description: "This Faculty ID doesn't exist. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    // Valid Faculty ID - redirect to community
    const message = `Hi! I'm ${facultyData.name} (Faculty ID: ${facultyId.trim()}). I'd like to join the Tech Faculty community.`;
    window.open(`https://chat.whatsapp.com/GCnw88T0nxs5oabYgcqXKt?text=${encodeURIComponent(message)}`, "_blank");
    
    setShowCommunityDialog(false);
    setFacultyId("");
    
    toast({
      title: "Verified!",
      description: "Opening WhatsApp community...",
    });
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Tech Faculty Logo" className="h-10 w-10" />
              <div>
                <div className="text-xl font-bold">Tech Faculty</div>
                <div className="text-xs text-muted-foreground">Get Trained, Certified, and Employed</div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/tech-store">
                <Button variant="ghost" size="sm">
                  <ShoppingBag className="mr-2" size={16} />
                  Tech Store
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCommunityClick}
              >
                <MessageCircle className="mr-2" size={16} />
                Join Community
              </Button>
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/tech-store" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="lg">
                      <ShoppingBag className="mr-2" size={20} />
                      Tech Store
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="lg"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleCommunityClick();
                    }}
                  >
                    <MessageCircle className="mr-2" size={20} />
                    Join Community
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Community Access Dialog */}
      <Dialog open={showCommunityDialog} onOpenChange={setShowCommunityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Tech Faculty Community</DialogTitle>
            <DialogDescription>
              Enter your Faculty ID to access our WhatsApp community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="communityFacultyId">Faculty ID</Label>
              <Input
                id="communityFacultyId"
                placeholder="e.g., TF-ABC123XYZ"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value.toUpperCase())}
                maxLength={50}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCommunityDialog(false);
                setFacultyId("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCommunityAccess} disabled={!facultyId.trim()}>
              Continue to Community
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
