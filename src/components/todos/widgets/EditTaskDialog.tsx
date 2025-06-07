'use client';

import React, { useState, useEffect } from 'react';
import { Task } from "@/types/taskTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  task,
  open,
  onOpenChange,
  onSave,
}) => {
  const [formData, setFormData] = useState<Task>({ ...task });

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    }
  }, [task]);

  const handleSave = () => {
    if (formData.title) {
      onSave({ ...formData });
      onOpenChange(false);
    }
  };

  // const formatDate = (date: Date | null) => {
  //   return date ? format(new Date(date), 'yyyy-MM-dd') : '';
  // };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-sm:bg-secondary">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Low</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
            //   value={formatDate(formData.dueDate)}
            //   onChange={(e) =>
            //     setFormData(prev => ({
            //       ...prev,
            //       dueDate: e.target.value ? new Date(e.target.value) : null,
            //     }))
            //   }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="important"
              checked={formData.isImportant}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isImportant: !!checked }))}
            />
            <Label htmlFor="important">Mark as important</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="planned"
              checked={formData.isPlanned}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPlanned: !!checked }))}
            />
            <Label htmlFor="planned">Add to planned</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
