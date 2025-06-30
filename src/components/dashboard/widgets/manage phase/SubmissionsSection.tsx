// File: widgets/ManagePhase/SubmissionsSection.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";
import { DocumentSubmission } from "@/types/timelineType";

interface SubmissionsSectionProps {
  isCreator: boolean;
  submissions: DocumentSubmission[];
  handleDeleteSubmission: (submission: DocumentSubmission) => void;
  handleEvaluateSubmission: (id: string, status: 'approved' | 'rejected') => void;
}

export const SubmissionsSection: React.FC<SubmissionsSectionProps> = ({
  isCreator,
  submissions,
  handleDeleteSubmission,
  handleEvaluateSubmission
}) => {
  return (
    <div className="grid gap-4">
      {submissions?.map((submission) => (
        <Card key={submission.id}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>{submission.document?.name}</CardTitle>
            {!isCreator && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteSubmission(submission)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{submission.document?.name}</span>
              </div>
              {isCreator && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEvaluateSubmission(submission.id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleEvaluateSubmission(submission.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
