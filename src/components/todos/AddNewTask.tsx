import { Task, TaskStatus } from '@/types/taskTypes';
import { PlusCircle } from 'lucide-react'
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface AddNewTaskProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const AddNewTask: React.FC<AddNewTaskProps> = ({ setTasks }) => {
  const params = useParams();
  const projectId = params.projectId as string;
  const assignedBy_id = "assignedBy_id"; // Replace with actual assignedBy_id logic
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    projectId: projectId,
    assignedBy_id: assignedBy_id,
    assignedTo_id: '', // Added missing required field
    isPlanned: false,
    isImportant: false,
    priority: 1,
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newTask.title?.trim()) {
      toast.error('Title is required');
      return;
    }

    const taskToAdd: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description || '',
      projectId: projectId,
      assignedBy_id: assignedBy_id,
      assignedTo_id: newTask.assignedTo_id || '', // You might want to add a field for this
      isPlanned: newTask.isPlanned || false,
      isImportant: newTask.isImportant || false,
      priority: newTask.priority || 1,
      status: TaskStatus.PENDING,
      dueDate: newTask.dueDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: '',
    };

    setTasks(prev => [...prev, taskToAdd]);

    // Reset form
    resetForm();
    setIsOpen(false);
    toast.success('Task added successfully!');
  };

  const resetForm = () => {
    setNewTask({ 
      title: '', 
      description: '',
      projectId,
      assignedBy_id,
      assignedTo_id: '',
      isPlanned: false,
      isImportant: false,
      priority: 1,
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: '',
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className='flex flex-col items-center justify-center 
          border-dashed border-2 gap-0 active:scale-95 select-none transition-all w-fit px-10 hover:cursor-pointer 
          max-sm:mt-10 h-fit rounded-2xl p-4'>
          <span>
            <PlusCircle size={46}/>
          </span>
          <span>New Task</span>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-sm:bg-secondary">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={newTask.title || ''}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTask.description || ''}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => setNewTask({...newTask, dueDate: new Date(e.target.value).toISOString()})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={newTask.priority?.toString() || '1'}
              onValueChange={(value) => setNewTask({...newTask, priority: parseInt(value)})}
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

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="important"
                checked={newTask.isImportant || false}
                onCheckedChange={(checked) => setNewTask({...newTask, isImportant: checked as boolean})}
              />
              <Label htmlFor="important">Important</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="planned"
                checked={newTask.isPlanned || false}
                onCheckedChange={(checked) => setNewTask({...newTask, isPlanned: checked as boolean})}
              />
              <Label htmlFor="planned">Planned</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewTask