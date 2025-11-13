import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ExternalLink, Youtube, Globe, FileText } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";

interface Resource {
  type: string;
  title: string;
  url: string;
}

interface HandoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classTitle: string;
  classNumber: number;
  course: string;
  resources: Resource[];
  handoutContent: string;
  description?: string;
}

export const HandoutModal = ({
  open,
  onOpenChange,
  classTitle,
  classNumber,
  course,
  resources,
  handoutContent,
  description,
}: HandoutModalProps) => {
  const [showFullHandout, setShowFullHandout] = useState(false);

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Header
    doc.setFontSize(20);
    doc.text(`Class ${classNumber} Handout`, margin, 20);
    
    doc.setFontSize(14);
    doc.text(course, margin, 30);
    
    doc.setFontSize(16);
    doc.text(classTitle, margin, 40);
    
    // Content
    doc.setFontSize(11);
    
    let yPosition = 50;
    
    // Add description if available
    if (description) {
      doc.setFontSize(12);
      doc.text("Description:", margin, yPosition);
      yPosition += 8;
      doc.setFontSize(11);
      const descLines = doc.splitTextToSize(description, maxWidth);
      descLines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });
      yPosition += 10;
    }
    
    const lines = doc.splitTextToSize(handoutContent.replace(/[#*]/g, ''), maxWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 7;
    });
    
    // Resources section
    if (resources && resources.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      yPosition += 10;
      doc.setFontSize(14);
      doc.text("Resources", margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      resources.forEach((resource) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${resource.title}: ${resource.url}`, margin, yPosition);
        yPosition += 7;
      });
    }
    
    doc.save(`${course}-Class-${classNumber}-Handout.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] sm:max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl leading-tight">
            Class {classNumber} - {classTitle}
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">{course}</p>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-2 sm:pr-4">
          {!showFullHandout ? (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                  Resources
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {resources && resources.length > 0 ? (
                    resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-3 rounded-lg border border-border hover:bg-accent transition-colors active:bg-accent min-h-[44px]"
                      >
                        {getResourceIcon(resource.type)}
                        <span className="flex-1 text-sm sm:text-base break-words">{resource.title}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </a>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No resources available</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => setShowFullHandout(true)}
                  className="w-full sm:flex-1"
                  variant="outline"
                  size="lg"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Show Full Handout</span>
                </Button>
                <Button
                  onClick={generatePDF}
                  className="w-full sm:flex-1"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Download PDF</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
              <Button
                onClick={() => setShowFullHandout(false)}
                variant="outline"
                size="default"
                className="min-h-[44px]"
              >
                ← Back to Resources
              </Button>
              
              <div className="prose prose-sm max-w-none space-y-4 overflow-y-auto flex-1 pr-2">
                {description && (
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold">Description</h3>
                    <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </div>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                  {handoutContent}
                </div>
              </div>
              
              <Button
                onClick={generatePDF}
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">Download PDF</span>
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
