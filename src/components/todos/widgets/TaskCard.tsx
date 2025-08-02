'use client';
import React, { useRef } from 'react';
import { Task, TaskStatus } from '@/types/taskTypes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle, 
  PauseCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Flag, 
  User, 
  Star,
  MoreHorizontal, 
  Edit3, 
  Trash2,
  AlertTriangle,
  ChartLineIcon,
  ArrowBigRightDash
} from 'lucide-react';
import ChangeTaskStatusDialog from './ChangeTaskStatusDialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const statusIconMap = {
  [TaskStatus.PENDING]: <Clock className="w-4 h-4 text-amber-500" />,
  [TaskStatus.IN_PROGRESS]: <ChartLineIcon className="w-4 h-4 text-blue-500" />,
  [TaskStatus.COMPLETED]: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  [TaskStatus.ON_HOLD]: <PauseCircle className="w-4 h-4 text-orange-500" />,
  [TaskStatus.CANCELLED]: <XCircle className="w-4 h-4 text-red-500" />,
};

const statusLabelMap = {
  [TaskStatus.PENDING]: 'Pending',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.COMPLETED]: 'Completed',
  [TaskStatus.ON_HOLD]: 'On Hold',
  [TaskStatus.CANCELLED]: 'Cancelled',
};

const TaskCard: React.FC<{ 
  task: Task; 
  onStatusChange: (id: string,NewStatus:TaskStatus) => void;
  onToggleImportant: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}> = ({ task, onStatusChange, onToggleImportant, onEdit, onDelete }) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false);
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;
  
  
  const user_id = useSelector((state:RootState)=> state.auth.user?.id); 
  const participants = useSelector((state:RootState)=> state.selectedProject.project?.participants);
  
  const assignedBy = participants?.find((x)=> x.id === task.assignedBy_id);
  const assignedTo = participants?.find((x)=> x.id === task.assignedTo_id);


  const getPriorityConfig = (priority: number) => {
    switch (priority) {
      case 1: return { color: 'text-red-500', label: 'High', variant: 'destructive' as const };
      case 2: return { color: 'text-amber-500', label: 'Medium', variant: 'secondary' as const };
      case 3: return { color: 'text-emerald-500', label: 'Low', variant: 'outline' as const };
      default: return { color: 'text-muted-foreground', label: 'None', variant: 'outline' as const };
    }
  };



  const priorityConfig = getPriorityConfig(task.priority);
  const touchStartTimeRef = useRef<number | null>(null);
  const LONG_PRESS_THRESHOLD = 500; // in milliseconds

  return (
      <Card
        onDoubleClick={() => {
            setIsStatusDialogOpen(true); // Open the status change dialog on double click
        }}
        onTouchStart={() => {
            touchStartTimeRef.current = Date.now();
          }}
        onTouchEnd={() => {
            const touchEndTime = Date.now();
            const duration = touchEndTime - (touchStartTimeRef.current ?? 0);

            if (duration >= LONG_PRESS_THRESHOLD) {
            setIsStatusDialogOpen(true);
            }
        }}
          
        className={`group transition-all max-sm:bg-transparent max-sm:border-none max-sm:shadow-none
         max-sm:p-2 max-sm:py-2 duration-200 pt-3 hover:shadow-md hover:border-primary/20 ${
        isCompleted ? 'opacity-70 bg-muted/30' : ''
      } ${isOverdue ? 'border-destructive/30 bg-destructive/5' : ''}`}>
        <ChangeTaskStatusDialog
          open={isStatusDialogOpen}
          onClose={()=> setIsStatusDialogOpen(false)} 
          onStatusChange={(newStatus) => onStatusChange(task.id,newStatus)}
          currentStatus={task.status}
          allowAll={user_id === assignedBy?.userId}
        />
        <CardContent className="p-4 pb-0 max-sm:p-0">
          <div className="flex items-start gap-3 ">
            {/* Completion Toggle */}
            <div className="flex-shrink-0 pt-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 rounded-full transition-colors ${
                      isCompleted 
                          ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950' 
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                      }`}
                   
                    onClick={() => 
                      setIsStatusDialogOpen(true) // Open the status change dialog
                      // onStatusChange(task.id)
                    }
                  >
                    {statusIconMap[task.status]}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change Status</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Task Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Header with Title and Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Overdue
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {statusLabelMap[task.status]}
                    </Badge>
                  </div>

                  <div className=' flex w-full '>
                    <h3 className={`font-semibold max-sm:text-sm text-base leading-tight ${
                      isCompleted 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}>
                      {task.title}
                    </h3>
                  </div>
                  
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-0 max-sm:opacity-100 group-hover:opacity-100 transition-opacity">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onToggleImportant(task.id)}
                      >
                        <Star className={`h-4 w-4 ${
                          task.isImportant 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-muted-foreground hover:text-amber-500'
                        }`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{task.isImportant ? 'Remove from important' : 'Mark as important'}</p>
                    </TooltipContent>
                  </Tooltip>
                  { assignedBy?.userId === user_id &&
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit task
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete(task.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className={`text-sm max-sm:text-xs max-sm:leading-1 ${
                  isCompleted 
                    ? 'line-through text-muted-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {task.description}
                </p>
              )}

              {/* Task Meta Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Due Date */}
                  {task.dueDate && (
                    <div className={`flex items-center gap-1.5 text-sm ${
                      isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                    }`}>
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(task.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: new Date(task.dueDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </span>
                    </div>
                  )}
                  
                  {/* Priority */}
                  <Badge variant={priorityConfig.variant} className="text-xs flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    {priorityConfig.label}
                  </Badge>

                  {/* Assignment */}
                  {task.assignedTo_id !== task.assignedBy_id && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Assigned
                    </Badge>
                  )}
                </div>

                {/* Additional Badges */}
                <div className="flex items-center gap-2">
                  {task.isPlanned && (
                    <Badge variant="outline" className="text-xs">
                      Planned
                    </Badge>
                  )}
                  
                  {task.isImportant && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Important
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className=' !pt-0'>
          <Tooltip>
            <TooltipTrigger>
              <div className=' w-full items-start justify-around'>
                  {
                    assignedBy?.userId === user_id ?
                    (task.assignedBy_id === task.assignedTo_id) ?
                    <></>
                    :
                    <div className=' flex items-center gap-5'>
                      {/* <div className=' font-thin'>To</div> */}
                      <div className='flex gap-1.5 items-center'>
                        <div className=' flex items-center gap-3'>
                          <Avatar>
                              <AvatarImage src={assignedBy?.user?.profilePicture} />
                              <AvatarFallback>{assignedBy?.user?.firstname?.substring(0,1)}</AvatarFallback>
                          </Avatar>
                          <ArrowBigRightDash className=' text-muted-foreground'/>
                          <Avatar>
                              <AvatarImage src={assignedTo?.user?.profilePicture} />
                              <AvatarFallback>{assignedTo?.user?.firstname?.substring(0,1)}</AvatarFallback>
                          </Avatar>
                        </div>
                            <div className=' flex items-start flex-col'>
                              <span className=' text-xs capitalize'>{assignedTo?.user?.firstname} {assignedTo?.user?.lastname}
                              </span>
                              {
                                assignedTo?.role && assignedTo?.role.trim().length > 0 &&
                                <span className=' text-muted-foreground capitalize text-xs'>{assignedTo?.role.replaceAll("_"," ")}</span>
                              }
                            </div>
                        </div>
                    </div>
                    :
                    <div className=' flex items-center gap-5'>
                      {/* <div>From</div> */}
                      <div className='flex gap-1.5 items-center'>
                        <div className=' flex items-center gap-3'>
                          <Avatar>
                              <AvatarImage src={assignedBy?.user?.profilePicture} />
                              <AvatarFallback>{assignedBy?.user?.firstname?.substring(0,1)}</AvatarFallback>
                          </Avatar>
                          <ArrowBigRightDash className=' text-muted-foreground'/>
                          <Avatar>
                              <AvatarImage src={assignedTo?.user?.profilePicture} />
                              <AvatarFallback>{assignedTo?.user?.firstname?.substring(0,1)}</AvatarFallback>
                          </Avatar>
                        </div>
                          <div className=' flex items-start flex-col'>
                            <span className=' text-xs capitalize'>{assignedBy?.user?.firstname} {assignedTo?.user?.lastname} (me)</span>
                            {
                              assignedBy?.role && assignedBy?.role.trim().length > 0 &&
                              <span className=' text-muted-foreground capitalize text-xs'>{assignedBy?.role.replaceAll("_"," ")}</span>
                            }
                          </div>
                      </div>
                    </div>
                  }
              </div>
            </TooltipTrigger>
            <TooltipContent>
            Assigned by {assignedBy?.user?.firstname} to {assignedTo?.user?.firstname}
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>      
  );
};

export default TaskCard;  