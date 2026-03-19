import fmstiLogo from "@/assets/partners/fmsti-logo.png";
import nbtiLogo from "@/assets/partners/nbti-logo.png";

interface CredibilityBannerProps {
  compact?: boolean;
}

const CredibilityBanner = ({ compact = false }: CredibilityBannerProps) => {
  return (
    <div className="bg-muted/50 border border-border rounded-xl p-6 md:p-8">
      <div className={`flex flex-col ${compact ? "md:flex-row" : ""} items-center gap-6`}>
        <div className="flex items-center gap-4 shrink-0">
          <img src={fmstiLogo} alt="Federal Ministry of Science, Technology and Innovation" className="h-14 w-14 md:h-16 md:w-16 object-contain" />
          <img src={nbtiLogo} alt="National Board for Technology Incubation" className="h-14 w-14 md:h-16 md:w-16 object-contain" />
        </div>
        <p className={`text-sm md:text-base text-muted-foreground ${compact ? "text-left" : "text-center"} leading-relaxed`}>
          <span className="font-semibold text-foreground">Tech Faculty</span> is licensed and partnered by the{" "}
          <span className="font-semibold text-foreground">Federal Ministry of Science, Technology and Innovation</span> via the{" "}
          <span className="font-semibold text-foreground">National Board for Technology Incubation (NBTI)</span> — to assist schools and businesses integrate standard and regulated use of AI and Technology across Africa.
        </p>
      </div>
    </div>
  );
};

export default CredibilityBanner;
