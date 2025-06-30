// File: widgets/ManagePhase/OverviewCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timeline } from "@/types/timelineType";

interface OverviewCardProps {
  phaseData: Timeline;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ phaseData }) => {
  const progress = (phaseData.verifiedDocuments / Math.max(phaseData.totalDocuments || 1)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phase Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {phaseData.verifiedDocuments} of {phaseData.totalDocuments} documents verified
        </p>
      </CardContent>
    </Card>
  );
};