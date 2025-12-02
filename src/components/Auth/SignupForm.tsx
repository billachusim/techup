import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const hearAboutUs = [
  "Social Media",
  "Friend/Colleague",
  "Google Search",
  "University/School",
  "Tech Event",
  "Other",
];

interface SignupFormProps {
  onSuccess: (userData: { 
    name: string; 
    email: string; 
    phone: string; 
    password: string;
    hearAbout: string;
  }) => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    hearAbout: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || 
        !formData.password.trim() || !formData.hearAbout) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    // If validation passes, immediately call onSuccess with form data
    // Modal will appear instantly, then signup happens when user confirms
    onSuccess({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      hearAbout: formData.hearAbout,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">{/* ... keep existing code */}
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          maxLength={100}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          maxLength={255}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+234 800 000 0000"
          maxLength={20}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Minimum 6 characters"
          minLength={6}
        />
      </div>

      <div>
        <Label htmlFor="hearAbout">How did you hear about us?</Label>
        <Select
          value={formData.hearAbout}
          onValueChange={(value) => setFormData({ ...formData, hearAbout: value })}
        >
          <SelectTrigger id="hearAbout">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {hearAboutUs.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
};
