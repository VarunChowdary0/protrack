import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Upload } from "lucide-react";
import { DocumentSubmission, RequiredDocument } from "@/types/timelineType";
import { useState } from "react";
import axiosInstance from "@/config/AxiosConfig";
import { toast } from "sonner";
import ReqDoc from "./subs/ReqDoc";

interface RequiredDocSectionProps {
  isCreator: boolean;
  timelineId: string;
  requiredDocuments: RequiredDocument[];
  submissions: DocumentSubmission[];
  fetchPhaseData: () => void; // Optional callback to refresh data after adding a document
}

export const RequiredDocSection: React.FC<RequiredDocSectionProps> = ({
  isCreator,
  timelineId,
  requiredDocuments,
  submissions,
  fetchPhaseData
}) => {
  // Local state for adding new documents
  const [newDocName, setNewDocName] = useState('');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [newFile, setNewFile] = useState({
    title: '',
    file: null as File | null,
  });
  
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewFile({
        ...newFile,
        file: file,
      })
    }
  }

  const getFileType = (name: string) => {
    const parts = name.split('.')
    return parts[parts.length - 1].toLowerCase()
  }

  const handleAddRequiredDoc = async () => {
    if (!newDocName.trim() || !newFile.file) return;

    setIsAddingDoc(true);
    const formData = new FormData();
    formData.append('timelineId', timelineId);
    formData.append('name', newDocName);
    formData.append('description', newDocDescription);
    formData.append('file', newFile.file)
    formData.append('fileType', getFileType(newFile.file.name)); // Assuming PDF, adjust as needed


    console.log('Adding required document:', { newDocName, newDocDescription, newFile });

    try {
      await axiosInstance.post('/api/project/manage/phase/add-required-doc', formData,{
          headers: { 'Content-Type': 'multipart/form-data' }
      });      
      // Reset form
      setNewDocName('');
      setNewDocDescription('');
      setNewFile({ title: '', file: null });
      setIsDialogOpen(false);
      fetchPhaseData();
      toast.success("Added Document");
    } catch (error) {
      console.error('Failed to add required document:', error);
      toast.error("Failed to Add");
    } finally {
      setIsAddingDoc(false);
    }
  };


  return (
    <div className="space-y-4">
      {isCreator && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Required Document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Required Document</DialogTitle>
              <DialogDescription>Define a new document requirement.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Document Name</Label>
                <Input 
                  value={newDocName} 
                  onChange={e => setNewDocName(e.target.value)}
                  placeholder="Enter document name"
                />
              </div>
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
                  className="border-2 border-dashed border-pr rounded-lg p-8 text-center hover:border-gray-400/30 transition-all cursor-pointer group"
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
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-primary rounded-full group-hover:bg-primary/90 transition-colors">
                      <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-accent-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, PDF, or DOCX files (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>}
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={newDocDescription} 
                  onChange={e => setNewDocDescription(e.target.value)}
                  placeholder="Enter document description"
                />
              </div>
              <Button 
                onClick={handleAddRequiredDoc} 
                disabled={isAddingDoc || !newDocName.trim()} 
                className="w-full"
              >
                {isAddingDoc ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <div className=" pt-5">
        {requiredDocuments && requiredDocuments.length > 0 ? (
          requiredDocuments.map((doc) => (
            <ReqDoc
              timelineId={timelineId}
              key={doc.id}
              fetchPhaseData={fetchPhaseData}
              requiredDocument={doc}
              isCreator={isCreator}  
              submissions={submissions.filter((sub)=> sub.referenceDocumentId === doc.id) } 
            />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-8">
            <p className="text-sm">No required documents found.</p>
          </div>
        )}
      </div>

    </div>
  );
};