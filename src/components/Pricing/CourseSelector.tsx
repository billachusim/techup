import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Course {
  id: string;
  name: string;
  price: number;
}

interface CourseSelectorProps {
  courses: Course[];
  selectedCourses: string[];
  onToggleCourse: (courseId: string) => void;
}

export const CourseSelector = ({ courses, selectedCourses, onToggleCourse }: CourseSelectorProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { formatPrice } = useCurrency();
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <span className="font-semibold text-foreground">Courses & Modules</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-3">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={course.id}
                checked={selectedCourses.includes(course.id)}
                onCheckedChange={() => onToggleCourse(course.id)}
              />
              <Label htmlFor={course.id} className="text-sm font-medium cursor-pointer text-foreground">
                {course.name}
              </Label>
            </div>
            <span className="text-sm font-semibold text-primary">₦{course.price.toLocaleString()}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
