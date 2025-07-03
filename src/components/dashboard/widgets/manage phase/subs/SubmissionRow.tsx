import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RootState } from '@/redux/store';
import { DocSubmissionStatus, DocumentSubmission } from '@/types/timelineType';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { format } from "date-fns";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Clock, Download, EyeIcon, FileText, ScanEye, Trash2, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubmissionRow:React.FC<{
    isCreator: boolean;
    submission: DocumentSubmission,
    handleDeleteSubmission: (submission: DocumentSubmission) => void;
    handleEvaluateSubmission: (id: string, status: DocSubmissionStatus, feedback?: string) => void;
    handleDownload?: (submission: DocumentSubmission) => void;
}> = ({
    isCreator,
    submission,
    handleDeleteSubmission,
    handleEvaluateSubmission,
    handleDownload
}) => {
    const auth = useSelector((state: RootState) => state.auth);
    const project = useSelector((state: RootState) => state.selectedProject);
    const [evaluationFeedback, setEvaluationFeedback] = useState<string>('');
    const [disable, setDisable] = useState<boolean>(false);
    const participant = project.project?.participants?.find(
    (p) => p.userId === auth.user?.id
    );
      
  const member = project.project?.participants?.find(
    (p) => p.id === submission.submittedBy
    ) || null;
      
  const getStatusBadgeColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
     <Card className={disable? "opacity-20" : ""} key={submission.id}>
        <div className=' w-full px-4 flex max-sm:flex-col justify-between py-2'>
            <div className="flex items-center gap-3 justify-between mb-2">
                <h3 className="text-lg font-semibold">Submission of</h3>
                <div className=' flex gap-2'>
                    <Badge>
                        {submission.requiredDocument?.name || 'Unknown Document'}
                    </Badge>
                    <Badge variant={"secondary"}>
                        {submission.requiredDocument?.referenceDocument?.fileType || 'Unknown Document'}
                    </Badge>
                </div>
            </div>
            <div className="flex items-center gap-3 justify-between mb-2">
                <h3 className="text-lg font-semibold">View Reference File</h3>
                <div>
                <Badge>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        href={submission.requiredDocument?.referenceDocument?.filePath}>
                        <ScanEye/>
                    </a>
                </Badge>
                </div>
            </div>
        </div>
                <CardHeader>
                  <div className="flex items-start !pt-0 justify-between">
                    <div className=' w-full'>
                      <CardTitle className="flex items-center gap-2">
                        <span className=' max-w-[270px] max-sm:max-w-[170px] truncate'>
                            {submission.document?.name}
                        </span>
                        <Badge className={getStatusBadgeColor(submission.status)}>
                          {submission.status || 'Pending'}
                        </Badge>
                      </CardTitle>
                        <div className="flex items-center gap-2 mt-3">
                            <div className=' flex w-full justify-between'>
                                <div className=' flex items-center gap-2'>
                                    <Avatar>
                                        <AvatarImage src={member?.user?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className=' flex gap-1'>
                                        <span>{member?.user?.firstname || 'Unknown'}</span>
                                        <span>{member?.user?.lastname || 'Unknown'}</span>
                                    </div>
                                    <div>
                                        <Badge variant="secondary" className="text-xs">
                                            {member?.role}
                                        </Badge>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(submission.createdAt), 'MMM d, yyyy HH:mm')}
                        </div>
                    </div>
                    <div className=' flex items-center gap-3'>
                        <div className=''>
                            <a href={submission.document?.filePath}
                                target="_blank"
                                rel="noopener noreferrer">
                                <EyeIcon className=' hover:text-blue-500'/>
                            </a>
                        </div>
                        {(!isCreator && submission.submittedBy === participant?.id && submission.status!==DocSubmissionStatus.APPROVED) && (
                        <Button
                            className=' hover:cursor-pointer'
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                setDisable(true);
                                handleDeleteSubmission(submission);
                                }
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="h-4 w-4" />
                      <span className="flex-1 truncate">
                        {submission.document?.filePath?.split('/').pop()}
                      </span>
                      <Badge className=" uppercase" variant="secondary">
                        {submission.document?.fileType || 'Unknown type'}
                      </Badge>
                      {handleDownload && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(submission)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* {submission.evaluationFeedback && (
                      <div className="p-3 bg-muted rounded text-sm">
                        <p className="font-medium mb-1">Feedback:</p>
                        <p className="text-muted-foreground">{submission.evaluationFeedback}</p>
                      </div>
                    )} */}

                    {isCreator && submission.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                            //   onClick={() => setSelectedSubmission(submission)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve Submission</DialogTitle>
                              <DialogDescription>
                                Add optional feedback for the submission
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              placeholder="Add feedback (optional)"
                              value={evaluationFeedback}
                              onChange={(e) => setEvaluationFeedback(e.target.value)}
                            />
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                onClick={() => {
                                  handleEvaluateSubmission(
                                    submission.id,
                                    DocSubmissionStatus.APPROVED,
                                    evaluationFeedback
                                  );
                                  setEvaluationFeedback('');
                                  setDisable(true);
                                //   setSelectedSubmission(null);
                                }}
                              >
                                Confirm Approval
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                            //   onClick={() => setSelectedSubmission(submission)}
                            >
                              <XIcon className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Submission</DialogTitle>
                              <DialogDescription>
                                Please provide feedback for the rejection
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              placeholder="Add rejection feedback"
                              value={evaluationFeedback}
                              onChange={(e) => setEvaluationFeedback(e.target.value)}
                              required
                            />
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleEvaluateSubmission(
                                    submission.id,
                                    DocSubmissionStatus.REJECTED,
                                    evaluationFeedback
                                  );
                                  setEvaluationFeedback('');
                                //   setSelectedSubmission(null);
                                }}
                                disabled={!evaluationFeedback.trim()}
                              >
                                Confirm Rejection
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
  )
}

export default SubmissionRow