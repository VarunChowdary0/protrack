import { CheckCircle } from "lucide-react";

interface TipSectionProps {
  title: string;
  content: string;
}

const TipSection = ({ title, content }: TipSectionProps) => (
  <div className=" flex items-start gap-3">
    <div>
      <CheckCircle className="w-6 h-6 max-sm:w-4 max-sm:h-4 text-green-500 mb-2" />
    </div>
    <div className="space-y-1 text-start">
      <h4 className="font-semibold text-sm text-primary">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed text-start">{content}</p>
    </div>
  </div>
);

export default TipSection;