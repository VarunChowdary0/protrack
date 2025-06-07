'use client';
import React from 'react';
import { Task, TaskStatus } from '@/types/taskTypes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  ChartLineIcon
} from 'lucide-react';

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
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}> = ({ task, onToggleComplete, onToggleImportant, onEdit, onDelete }) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  const getPriorityConfig = (priority: number) => {
    switch (priority) {
      case 1: return { color: 'text-red-500', label: 'High', variant: 'destructive' as const };
      case 2: return { color: 'text-amber-500', label: 'Medium', variant: 'secondary' as const };
      case 3: return { color: 'text-emerald-500', label: 'Low', variant: 'outline' as const };
      default: return { color: 'text-muted-foreground', label: 'None', variant: 'outline' as const };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);

  return (
      <Card className={`group transition-all max-sm:bg-transparent max-sm:border-none max-sm:shadow-none
         max-sm:p-2 max-sm:py-2 duration-200 hover:shadow-md hover:border-primary/20 ${
        isCompleted ? 'opacity-70 bg-muted/30' : ''
      } ${isOverdue ? 'border-destructive/30 bg-destructive/5' : ''}`}>
        <CardContent className="p-4 max-sm:p-0">
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
                    onClick={() => onToggleComplete(task.id)}
                  >
                    {statusIconMap[task.status]}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCompleted ? 'Mark as incomplete' : 'Mark as complete'}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Task Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Header with Title and Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {statusLabelMap[task.status]}
                    </Badge>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className={`font-semibold max-sm:text-sm text-base leading-tight ${
                    isCompleted 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                  }`}>
                    {task.title}
                  </h3>
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
      </Card>      
  );
};

export default TaskCard;  