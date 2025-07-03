// File: widgets/ManagePhase/SubmissionsSection.tsx

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Filter,
  SortAsc,
  Loader2
} from "lucide-react";
import { DocSubmissionStatus, DocumentSubmission } from "@/types/timelineType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SubmissionRow from "./subs/SubmissionRow";

interface SubmissionsSectionProps {
  isCreator: boolean;
  submissions: DocumentSubmission[];
  handleDeleteSubmission: (submission: DocumentSubmission) => void;
  handleEvaluateSubmission: (id: string, status: DocSubmissionStatus, feedback?: string) => void;
  handleDownload?: (submission: DocumentSubmission) => void;
  isLoading?: boolean;
}

export const SubmissionsSection: React.FC<SubmissionsSectionProps> = ({
  isCreator,
  submissions,
  handleDeleteSubmission,
  handleEvaluateSubmission,
  handleDownload,
  isLoading = false
}) => {

  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<DocSubmissionStatus|"ALL">("ALL");

  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return (b.status || '').localeCompare(a.status || '');
  });

  const filteredSubmissions = filterStatus === "ALL"
    ? sortedSubmissions
    : sortedSubmissions.filter(s => s.status === filterStatus);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Document Submissions</h3>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('status')}>
                Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("ALL")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus(DocSubmissionStatus.PENDING)}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus(DocSubmissionStatus.APPROVED)}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus(DocSubmissionStatus.REJECTED)}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No submissions found {filterStatus && `with status ${filterStatus}`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid gap-4">
            {filteredSubmissions.map((submission) => (
              <SubmissionRow
                key={submission.id}
                submission={submission}
                isCreator={isCreator}
                handleDeleteSubmission={handleDeleteSubmission}
                handleEvaluateSubmission={handleEvaluateSubmission}
                handleDownload={handleDownload}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
