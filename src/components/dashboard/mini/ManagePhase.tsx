"use client";

import NotFound from '@/components/NotFound';
import axiosInstance from '@/config/AxiosConfig';
import { RootState } from '@/redux/store';
import { Timeline, DocumentSubmission, RequiredDocument, DocSubmissionStatus } from '@/types/timelineType';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Modular Components
import { OverviewCard } from '../widgets/manage phase/OverviewCard';
import { RequiredDocSection } from '../widgets/manage phase/RequiredDocSection';
import { SubmissionsSection } from '../widgets/manage phase/SubmissionsSection';

const ManagePhase: React.FC = () => {
  const { timeline_id } = useParams();
  const auth = useSelector((state: RootState) => state.auth);
  const project = useSelector((state: RootState) => state.selectedProject);

  const [isLoading, setIsLoading] = useState(true);
  const [phaseData, setPhaseData] = useState<Timeline>();
  const [activeTab, setActiveTab] = useState('overview');

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

  useEffect(() => {
    console.log(phaseData)
  },[phaseData])


  const participant = project.project?.participants?.find(
    (p) => p.user?.id === auth.user?.id
  ) || null;

  const handleEvaluateSubmission = async (
    submissionId: string,
    status: DocSubmissionStatus,
    feedback?: string
  ) => {
    try {
      await axiosInstance.post('/api/project/manage/phase/submit-docs/review', {
        documentSubmissionId: submissionId,
        status,
        remarks: feedback || '',
        reviewdBy: participant?.id
      });
      toast.success('Submission reviewed');
      fetchPhaseData();
    } catch {
      toast.error('Failed to review submission');
    }
  };

  const handleDeleteSubmission = async (submission: DocumentSubmission) => {
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

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin h-10 w-10 text-teal-500' />
      </div>
    );
  }

  if (!timeline_id || !phaseData) return <NotFound />;

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

            <TabsContent value="overview">
              <OverviewCard phaseData={phaseData} />
            </TabsContent>

            <TabsContent value="documents">
              <RequiredDocSection
                isCreator={isCreator}
                timelineId={timeline_id as string}
                requiredDocuments={phaseData.requiredDocuments as RequiredDocument[]}
                // uploadingFiles={uploadingFiles}
                fetchPhaseData={fetchPhaseData}

                submissions={phaseData.documentSubmissions || []}
              />
            </TabsContent>

            <TabsContent value="submissions">
              <SubmissionsSection
                isCreator={isCreator}
                submissions={phaseData.documentSubmissions || []}
                handleDeleteSubmission={handleDeleteSubmission}
                handleEvaluateSubmission={handleEvaluateSubmission}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagePhase;
