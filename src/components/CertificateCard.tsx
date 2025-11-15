import { Award, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

interface CertificateCardProps {
  certificate: {
    id: string;
    course_name: string;
    certificate_number: string;
    issued_at: string;
  };
  studentName: string;
}

export const CertificateCard = ({ certificate, studentName }: CertificateCardProps) => {
  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Certificate background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Border
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    
    // Inner border
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 267, 180);

    // Title
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Certificate of Completion', 148.5, 50, { align: 'center' });

    // Subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });

    // Student name
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(studentName, 148.5, 90, { align: 'center' });

    // Course completion text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('has successfully completed the', 148.5, 105, { align: 'center' });

    // Course name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(certificate.course_name, 148.5, 120, { align: 'center' });

    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const issueDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Issued on ${issueDate}`, 148.5, 145, { align: 'center' });

    // Certificate number
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Certificate No: ${certificate.certificate_number}`, 148.5, 160, { align: 'center' });

    // Footer
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Tech Faculty', 148.5, 180, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Building Tomorrow\'s Tech Leaders', 148.5, 187, { align: 'center' });

    // Save the PDF
    doc.save(`${certificate.certificate_number}.pdf`);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{certificate.course_name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Issued: {new Date(certificate.issued_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Certificate No: {certificate.certificate_number}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};