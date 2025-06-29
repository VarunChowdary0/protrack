// Need fixing
// api 

"use client";

import NotFound from '@/components/NotFound';
import axiosInstance from '@/config/AxiosConfig';
import { RootState } from '@/redux/store';
import { DocumentSubmission, RequiredDocument, Timeline } from '@/types/timelineType';
import {
  FileText, Loader2, Plus, Trash2, Upload
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ManagePhase: React.FC = () => {
  const { timeline_id } = useParams();
  const auth = useSelector((state: RootState) => state.auth);
  const project = useSelector((state: RootState) => state.selectedProject);

  const [isLoading, setIsLoading] = useState(true);
  const [phaseData, setPhaseData] = useState<Timeline>();
  const [activeTab, setActiveTab] = useState('overview');
  const [newDocName, setNewDocName] = useState('');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});


  const isCreator = auth?.user?.id === project?.project?.creator_id;

  const fetchPhaseData = () => {
    setIsLoading(true);
    axiosInstance.get(`/api/project/phase/get-by-phase`, {
      params: { timelineId: timeline_id }
    })
      .then((res) => setPhaseData(res.data))
      .catch(() => toast.error("Could not fetch phase data"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (timeline_id) fetchPhaseData();
    else setIsLoading(false);
  }, [timeline_id]);

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin h-10 w-10 text-teal-500' />
      </div>
    );
  }

  if (!timeline_id || !phaseData) return <NotFound />;

  const handleAddRequiredDoc = async () => {
    if (!newDocName.trim()) {
      toast.error('Document name is required');
      return;
    }

    const formData = new FormData();
    formData.append('timelineId', timeline_id as string);
    formData.append('name', newDocName.trim());
    formData.append('description', newDocDescription.trim());
    formData.append('fileType', 'pdf'); // or dynamically set

    formData.append('file', new File([""], "placeholder.pdf")); // Replace with actual file upload logic

    setIsAddingDoc(true);
    try {
      await axiosInstance.post('/api/project/manage/phase/add-required-docs', formData);
      toast.success('Document requirement added successfully');
      fetchPhaseData();
      setNewDocName('');
      setNewDocDescription('');
    } catch {
      toast.error('Failed to add document requirement');
    } finally {
      setIsAddingDoc(false);
    }
  };

  const handleFileSubmission = async (docId: string, file: File) => {
    setUploadingFiles(prev => ({ ...prev, [docId]: true }));
    const formData = new FormData();
    formData.append('timelineId', timeline_id as string);
    formData.append('referenceDocumentId', docId);
    formData.append('fileType', 'pdf'); // or detect from file
    formData.append('file', file);

    try {
      await axiosInstance.post('/api/project/manage/phase/submit-docs', formData);
      toast.success('Document submitted successfully');
      fetchPhaseData();
    } catch {
      toast.error('Failed to submit document');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [docId]: false }));
    }
  };

  const handleEvaluateSubmission = async (
    submissionId: string,
    status: 'approved' | 'rejected',
    remarks?: string
  ) => {
    try {
      await axiosInstance.post('/api/project/manage/phase/submit-docs/review', {
        documentSubmissionId: submissionId,
        status,
        remarks,
      });
      toast.success('Submission reviewed');
      fetchPhaseData();
    } catch {
      toast.error('Failed to review submission');
    }
  };

  const handleDeleteSubmission = async (submission:DocumentSubmission) => {
    try {
      await axiosInstance.delete(`/api/project/manage/phase/submit-docs/delete`, {
        params: {
          timelineId: timeline_id,
          refDocumentId: submission.referenceDocumentId
        }
      });
      toast.success('Submission deleted');
      fetchPhaseData();
    } catch {
      toast.error('Failed to delete submission');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{phaseData?.title || 'Phase Details'}</CardTitle>
          <CardDescription>Manage phase documents and submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">
                {isCreator ? 'Required Documents' : 'Submit Documents'}
              </TabsTrigger>
              <TabsTrigger value="submissions">
                {isCreator ? 'All Submissions' : 'My Submissions'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Phase Progress</CardTitle></CardHeader>
                <CardContent>
                  <Progress
                    value={(phaseData.verifiedDocuments / Math.max(phaseData.totalDocuments || 1)) * 100}
                    className="w-full h-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {phaseData.verifiedDocuments} of {phaseData.totalDocuments} documents verified
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              {isCreator && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4 mr-2" /> Add Required Document</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Required Document</DialogTitle>
                      <DialogDescription>Define a new document requirement.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Label>Document Name</Label>
                      <Input value={newDocName} onChange={e => setNewDocName(e.target.value)} />
                      <Label>Description</Label>
                      <Textarea value={newDocDescription} onChange={e => setNewDocDescription(e.target.value)} />
                      <Button onClick={handleAddRequiredDoc} disabled={isAddingDoc} className="w-full">
                        {isAddingDoc ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        Add Document
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <div className="grid gap-4">
                {phaseData.requiredDoucments?.map((doc:RequiredDocument) => (
                  <Card key={doc.id}>
                    <CardHeader>
                      <CardTitle>{doc.name}</CardTitle>
                      <CardDescription>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!isCreator && (
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleFileSubmission(doc.id, e.target.files[0]);
                              }
                            }}
                            disabled={uploadingFiles[doc.id]}
                          />
                          <Button disabled={uploadingFiles[doc.id]}>
                            {uploadingFiles[doc.id] ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4" />}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

            </TabsContent>

            <TabsContent value="submissions" className="space-y-4">
              <div className="grid gap-4">
                {phaseData.documentSubmissions?.map((submission: DocumentSubmission) => (
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagePhase;
