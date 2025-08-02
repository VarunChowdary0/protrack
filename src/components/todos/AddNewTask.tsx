import { Task, TaskStatus } from '@/types/taskTypes';
import { Loader2, PlusCircle } from 'lucide-react'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
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
import axiosInstance from '@/config/AxiosConfig';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Participant } from '@/types/participantType';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface AddNewTaskProps {
  setTasks: (task:Task) => void;
}

const AddNewTask: React.FC<AddNewTaskProps> = ({ setTasks }) => {
  const params = useParams();
  const projectId = params.project_id as string;
  const [isLoading, setloading] = useState<boolean>(false);
  const user_id = useSelector((state:RootState)=> state.auth.user?.id); 
  const participants = useSelector((state:RootState)=> state.selectedProject.project?.participants);
  const assignedBy_id = participants?.find((parti) => parti.userId === user_id)?.id; 
  const [isOpen, setIsOpen] = useState(false);
  const [selecedParticipant, setSelected] = useState<Partial<Participant>>();
  const [newTask, setNewTask] = useState<Partial<Task>>({
    projectId: projectId,
    title: '',
    description: '',
    dueDate: new Date().toISOString(),
    assignedTo_id: assignedBy_id || '', // Added missing required field
    assignedBy_id: assignedBy_id || '',
    isPlanned: false,
    isImportant: false,
    status: TaskStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: '',
    priority: 1,
  });

  useEffect(() => {
    console.log("Test0000: ",user_id, assignedBy_id);
  },[user_id, participants])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!newTask.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!newTask.description?.trim()) {
      toast.error('Description is required');
      return;
    }

    let filteredTask;
    if(newTask.assignedTo_id === ""){
      if(isForAnother){
        filteredTask = {
          ...newTask,
          assignedBy_id,
          assignedTo_id: selecedParticipant?.id,
          projectId: projectId
        }
      }
      else{
        filteredTask = {
          ...newTask,
          assignedBy_id,
          assignedTo_id: assignedBy_id,
          projectId: projectId
        }
      }
    }else{
      filteredTask = {
        ...newTask,
        assignedBy_id,
        projectId: projectId
      }
    }
    console.log(filteredTask);
    try{
      setloading(true);
      const response = await axiosInstance.post("/api/manage/tasks/new",filteredTask);
      setTasks(response.data);
      resetForm();
      setIsOpen(false);
      toast.success('Task added successfully!');
    }
    catch(error){
      console.error(error);
      toast.error("Failed to add task");
    }
    finally{
      setloading(false);
    }
  };

  const resetForm = () => {
    setNewTask({ 
      title: '', 
      description: '',
      projectId,
      assignedBy_id,
      assignedTo_id: assignedBy_id,
      isPlanned: false,
      isImportant: false,
      priority: 1,
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: '',
    });
  };

  const [isForAnother,setForOther] =  useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className='flex flex-col items-center justify-center bg-amber-500 hover:cursor-pointer 
          max-sm:mt-10 h-fit rounded-full p-2'>
          <span>
            <PlusCircle size={24}/>
          </span>
          {/* <span>New Task</span> */}
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

          <div className=' flex items-center justify-between w-full'>
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
            {
              isForAnother 
              ?
              <div className=' w-fit py-1 mt-4'>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {
                      selecedParticipant?
                      <div className=' flex items-center gap-2'>
                        Assign to
                        <Avatar>
                          <AvatarImage src={selecedParticipant?.user?.profilePicture} />
                          <AvatarFallback>{selecedParticipant?.user?.firstname?.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <div className=' flex items-start flex-col'>
                          <span className=' text-xs capitalize'>{selecedParticipant?.user?.firstname} {selecedParticipant?.user?.lastname}
                          </span>
                          {
                            selecedParticipant?.role && selecedParticipant?.role.trim().length > 0 &&
                            <span className=' text-muted-foreground capitalize text-xs'>{selecedParticipant?.role.replaceAll("_"," ")}</span>
                          }
                        </div>
                      </div>
                      :
                      <Button>Select Participant</Button>
                    }
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Assign to</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                      participants?.map((ele)=>
                        <DropdownMenuItem key={ele.id} onClick={()=>{
                            setSelected(ele);
                            setNewTask({...newTask, assignedTo_id: ele.id})
                          }
                        }>
                          <div className=' flex items-center gap-2'>
                            <Avatar>
                              <AvatarImage src={ele?.user?.profilePicture} />
                              <AvatarFallback>{ele?.user?.firstname?.substring(0,1)}</AvatarFallback>
                            </Avatar>
                            <div className=' flex items-start flex-col'>
                              <span className=' text-xs capitalize'>{ele?.user?.firstname} {ele?.user?.lastname}
                              </span>
                              {
                                ele?.role && ele?.role.trim().length > 0 &&
                                <span className=' text-muted-foreground capitalize text-xs'>{ele?.role.replaceAll("_"," ")}</span>
                              }
                            </div>
                          </div>
                        </DropdownMenuItem>
                      )
                    }
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              :
              <Button onClick={()=> setForOther(true)}>Assign task</Button>
            }
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

          {!isLoading ?
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
          :
          <div className=' w-full flex items-center justify-center'>
            <Loader2 className=' animate-spin'/>  
          </div>
        }
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewTask