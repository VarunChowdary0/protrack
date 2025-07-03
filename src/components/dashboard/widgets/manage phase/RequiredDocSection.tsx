// File: widgets/ManagePhase/RequiredDocSection.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Upload } from "lucide-react";
import { RequiredDocument } from "@/types/timelineType";

interface RequiredDocSectionProps {
  isCreator: boolean;
  requiredDocuments: RequiredDocument[];
  newDocName: string;
  newDocDescription: string;
  newDocFile: File | null;
  uploadingFiles: { [key: string]: boolean };
  setNewDocName: (v: string) => void;
  setNewDocDescription: (v: string) => void;
  setNewDocFile: (f: File | null) => void;
  handleAddRequiredDoc: () => void;
  handleFileSubmission: (docId: string, file: File) => void;
  isAddingDoc: boolean;
}

export const RequiredDocSection: React.FC<RequiredDocSectionProps> = ({
  isCreator,
  requiredDocuments,
  newDocName,
  newDocDescription,
  newDocFile,
  uploadingFiles,
  setNewDocName,
  setNewDocDescription,
  setNewDocFile,
  handleAddRequiredDoc,
  handleFileSubmission,
  isAddingDoc
}) => {
  return (
    <div className="space-y-4">
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
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) setNewDocFile(e.target.files[0]);
                }}
              />
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
        {requiredDocuments?.map((doc) => (
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
                      if (e.target.files?.[0]) handleFileSubmission(doc.id, e.target.files[0]);
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
    </div>
  );
};
