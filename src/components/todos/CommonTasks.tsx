"use client"

import { Task, TaskStatus } from '@/types/taskTypes';
import React from 'react'
import TaskCard from './widgets/TaskCard';
import { toast } from 'sonner';
import EditTaskDialog from './widgets/EditTaskDialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,    
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { deleteTaskAsync, updateTaskAsync } from '@/redux/reducers/TasksReducer';

interface CommonTasksProps {
    tasks: Task[];
    title: string;
}
const CommonTasks:React.FC<CommonTasksProps> = (props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [editingTask, setEditingTask] = React.useState<Task | null>(null);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [deleteTaskId, setDeleteTaskId] = React.useState<string | null>(null);
    const [tasks, setTasks] = React.useState<Task[]>(props.tasks); // sort by due date

    
    const handleStatusChange = (taskId: string, NewStatus: TaskStatus) => {
      const updated = tasks.map(task =>
        task.id === taskId ? { ...task, status: NewStatus } : task
      );
      const updatedTask = updated.find(t => t.id === taskId);
      if (!updatedTask) return;

      setTasks(updated);
      dispatch(updateTaskAsync(updatedTask));
      toast.success("Task status updated successfully");
    };


  const confirmDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId);
  };

  const executeDelete = () => {
    if (deleteTaskId) {
      setTasks(prev => prev.filter(task => task.id !== deleteTaskId));
      dispatch(deleteTaskAsync(deleteTaskId));
      setDeleteTaskId(null);
      toast.success("Task deleted successfully");
    } else {
      toast.error("No task selected for deletion");
    }
  };


  const handleToggleImportant = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, isImportant: !task.isImportant } : task
    );
    const updatedTask = updatedTasks.find(task => task.id === taskId);
    if (!updatedTask) return;

    setTasks(updatedTasks);
    dispatch(updateTaskAsync(updatedTask));
    toast.success("Task updated");
  };



  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedTask: Task) => {
    setTasks(prev =>
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    setEditingTask(null);
    dispatch(updateTaskAsync(updatedTask));
    toast.success("Task updated successfully");
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6 max-sm:p-3 space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 max-sm:text-md max-sm:mt-14 dark:text-gray-100">{props.title}</h1>
            {/* <div className="text-sm flex gap-2 text-gray-500">
              <Badge variant={'destructive'}>
                  {pendingTasks.length + overdeueTasks.length} remaining
              </Badge>
              <Badge variant={'outline'}>
                  {completedTasks.length} completed
              </Badge>
              <Badge variant={'secondary'}>
                  {pausedTasks.length} on-hold
              </Badge>
            </div> */}
            {/* <AddNewTask setTasks={setTasks}/> */}
        </div>
        <div className='grid grid-cols-1 max-sm:mb-10 max-sm:mt-3 md:grid-cols-2 max-sm:!divide-y lg:grid-cols-3 max-sm:gap-2 gap-6'>
                {tasks.map((task,idx) => (
                <>
                    <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onToggleImportant={handleToggleImportant}
                        onEdit={handleEdit}
                        onDelete={confirmDeleteTask}
                    />
                    {
                        !(idx+1 === tasks.length) &&
                        <div className="h-[0.5px] w-full hidden max-sm:block dark:bg-[#56565608]  bg-[#565656]"></div>
                    }
                </>
            ))}
        </div>
        { editingTask &&
        <EditTaskDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />}
      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent className=' max-sm:bg-secondary'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default CommonTasks