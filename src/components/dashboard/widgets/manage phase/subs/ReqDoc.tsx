import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/config/AxiosConfig';
import { RootState } from '@/redux/store';
import { DocSubmissionStatus, DocumentSubmission, RequiredDocument } from '@/types/timelineType';
import { Check, Download, FileText, Loader2, Upload } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const ReqDoc:React.FC<{
    timelineId: string;
    requiredDocument: RequiredDocument;
    isCreator: boolean;
    submissions: DocumentSubmission[];
    fetchPhaseData: () => void; // Optional callback to refresh data after actions
}> = ({
    timelineId,
    requiredDocument,
    isCreator,
    submissions,
    fetchPhaseData
}) => {
    console.log(submissions)
    const auth = useSelector((state: RootState) => state.auth);
    const project = useSelector((state: RootState) => state.selectedProject);
    const participant = project.project?.participants?.find(
            (p) => p.user?.id === auth.user?.id
        ) || null; 
    const isSubmitted = participant ? submissions.some((submission) => submission.submittedBy === participant.id) : false;
    const submissionStatus = participant ? (submissions.find((submission) => submission.submittedBy === participant.id))?.status : DocSubmissionStatus.PENDING;
    console.log("Participant:", participant, isSubmitted);


    const [newFile, setNewFile] = useState({
        title: '',
        file: null as File | null,
    });
    const [isUploading, setIsUploading] = useState(false);

    const getFileType = (name: string) => {
        const parts = name.split('.')
        return parts[parts.length - 1].toLowerCase()
    }
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
        setNewFile({
            ...newFile,
            file: file,
        })
        }
    }

    const handleFileSubmission = async () => {
        if(!newFile.file) {
            toast.error("Please select a file to upload");
            return;
        }
        const formData = new FormData();
        formData.append('timelineId', timelineId);
        formData.append('referenceDocumentId', requiredDocument.id);
        formData.append('fileType', getFileType(newFile.file.name));
        formData.append('file', newFile.file);
        
        try{
            setIsUploading(true);
            const response = await axiosInstance.post('/api/project/manage/phase/submit-docs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("File upload response:", response.data);
            fetchPhaseData(); // Refresh the phase data after submission
            toast.success("File uploaded successfully");
        }
        catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload file");
        } finally {
            setIsUploading(false);
            setNewFile({ title: '', file: null });
            toast.success("File uploaded successfully");
        }
    } 
    return (
        <div key={requiredDocument.id} className=" flex border p-2 px-4 rounded-md
         max-sm:flex-col transition-all justify-between">
              <div className="pb-2">
                <div className=" flex items-center gap-2">
                  <div className="text-lg font-semibold">{requiredDocument.name}</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <Badge>
                      {requiredDocument.referenceDocument?.fileType || "N/A"}
                    </Badge>
                  </div>
                  {
                    isSubmitted &&
                    <div className=' w-6 h-6 p-1 rounded-full  flex items-center justify-center
                    bg-green-500'>
                        <Check/>
                    </div>
                    }
                </div>
                <div className="text-muted-foreground text-md max-sm:text-sm">{requiredDocument.description}</div>
              </div>

              <div className=" flex flex-col max-sm:items-start gap-3 justify-end items-end">
                <div className="flex gap-3 flex-wrap">
                  {requiredDocument.referenceDocument?.filePath && (
                    <>
                      <a
                        href={requiredDocument.referenceDocument.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="flex gap-2 items-center">
                          <FileText className="h-4 w-4" />
                          View
                        </Button>
                      </a>
                      <a href={requiredDocument.referenceDocument.filePath} download>
                        <Button variant="secondary" className="flex gap-2 items-center">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </a>
                    </>
                  )}
                </div>
                {!isCreator && submissionStatus !== DocSubmissionStatus.APPROVED && (
                  <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                                  <div>
                { newFile.file ?
                    <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="font-medium">{newFile.file.name}</p>
                        <div className="text-sm text-muted-foreground">
                        <span>{(newFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span className="mx-2">•</span>
                        <span>{getFileType(newFile.file.name).toUpperCase()}</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setNewFile({ title: '', file: null })}
                    >
                        Remove
                    </Button>
                    </div>
                    </div>
                    :
                    <div
                        className="border-2 border-dashed border-pr rounded-lg p-4 text-center hover:border-gray-400/30 transition-all cursor-pointer group"
                        onClick={() => {
                            const fileInput = document.getElementById("file-upload") as HTMLInputElement
                            fileInput?.click()
                        }}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*,.pdf,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2">
                            <Upload className="h-4 w-4 text-gray-500" />
                            <p className="text-sm text-accent-foreground">
                                Click to upload file (PNG, JPG, PDF, DOCX)
                            </p>
                        </div>
                    </div>
                }
            </div>
                    <Button
                      variant="default"
                      disabled={isUploading}
                      onClick={handleFileSubmission}
                      className="flex gap-2 items-center"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isSubmitted ? "Updating..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          {isSubmitted ? "Update Submission" : "Submit Document"}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
  )
}

export default ReqDoc