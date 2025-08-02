"use client"

import React, { useState } from 'react';
// import { mockTasks } from './MockData';
import TaskCard from './widgets/TaskCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Task, TaskStatus } from '@/types/taskTypes';
import { CheckCircle } from 'lucide-react';
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
import { toast } from "sonner"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { deleteTaskAsync, updateTaskAsync } from '@/redux/reducers/TasksReducer';

const AllTasks: React.FC = () => {
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const tasks = useSelector((state:RootState)=> state.tasks.tasks);
  const dispatch = useDispatch<AppDispatch>();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Handles status change
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) {
      toast.error("Task not found");
      return;
    }

    const updatedTask = {
      ...taskToUpdate,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateTaskAsync(updatedTask));
    toast.success("Task status updated successfully");
  };

  // Handles task deletion
  const executeDelete = () => {
    if (deleteTaskId) {
      dispatch(deleteTaskAsync(deleteTaskId))
      setDeleteTaskId(null);
      toast.success("Task deleted successfully");
    } else {
      toast.error("No task selected for deletion");
    }
  };

  // Toggle importance
  const handleToggleImportant = (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) {
      toast.error("Task not found");
      return;
    }

    const updatedTask = {
      ...taskToUpdate,
      isImportant: !taskToUpdate.isImportant,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateTaskAsync(updatedTask));
    toast.success(updatedTask.isImportant ? "Marked as Important" : "Unmarked as Important");
  };

  // Save edits
  const handleSaveEdit = (updatedTask: Task) => {
    dispatch(updateTaskAsync({
      ...updatedTask,
      updatedAt: new Date().toISOString(),
    }));
    setEditingTask(null);
    toast.success("Task updated successfully");
  };
  

  const confirmDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId);
  };
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);
  const pausedTasks = tasks.filter(task => task.status === TaskStatus.ON_HOLD);
  const overdeueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return task.status !== TaskStatus.COMPLETED && dueDate < new Date();
  });
  const cancelledTasks = tasks.filter(task => task.status === TaskStatus.CANCELLED);
  const pendingTasks = tasks.filter(task => 
    task.status !== TaskStatus.COMPLETED &&
    task.status !== TaskStatus.ON_HOLD && 
    task.status !== TaskStatus.CANCELLED &&
    !overdeueTasks.includes(task)
  );

  const tabs = [
    { id: 'overdue', label: 'Overdue', count: overdeueTasks.length, color : "red",data: overdeueTasks },
    { id: 'Pending', label: 'Pending', count: pendingTasks.length, color: "amber", data: pendingTasks },
    { id: 'Completed', label: 'Completed', count: completedTasks.length, color: "green", data: completedTasks },
    { id: 'Paused', label: 'Paused', count: pausedTasks.length, color: "blue", data: pausedTasks },
    { id: 'Cancelled', label: 'Cancelled', count: cancelledTasks.length, color:"orange", data: cancelledTasks },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 max-sm:p-3 space-y-6">
      <div className=' hidden'>
        <span className=' bg-red-500'></span>
        <span className=' bg-blue-500'></span>
        <span className=' bg-amber-500'></span>
        <span className=' bg-green-500'></span>
        <span className=' bg-orange-500'></span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 max-sm:text-md max-sm:mt-14 dark:text-gray-100">All Tasks</h1>
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
      </div>

        <div className="  p-0">
          <Tabs defaultValue="Pending" className="w-full flex">
            <TabsList className="grid w-fit grid-cols-2 bg-primary-foreground 
            shadow sm:grid-cols-3 !rounded-2xl lg:grid-cols-5 gap-1 h-auto p-1 ">
              {
                tabs.map(tab => (
                
                <TabsTrigger 
                  value={tab.id} 
                  key={tab.id}
                  className="flex items-center justify-center !rounded-2xl gap-1.5 px-2 py-2.5 text-xs sm:text-sm font-medium transition-all 
                  data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <span className={`flex items-center justify-center min-w-[18px] h-[18px] text-[10px] sm:text-xs font-bold rounded-full text-white bg-${tab.color}-500`}>
                    {tab.count}
                  </span>
                  <span >{tab.label}</span>
                </TabsTrigger>


                ))
              }
            </TabsList>
            {
              tabs.map((tab,idx) => (
                <TabsContent className='grid grid-cols-1 max-sm:mb-10 max-sm:mt-3 md:grid-cols-2 max-sm:!divide-y lg:grid-cols-3 max-sm:gap-2 gap-6'
                value={tab.id} key={tab.id}>
                  {tab.data.map(task => (
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
                         !(idx+1 === tabs.length) &&
                          <div className="h-[0.5px] w-full hidden max-sm:block dark:bg-[#56565608]  bg-[#565656]"></div>
                      }
                    </>

                  ))}
                </TabsContent>
              ))
            }

          </Tabs>
                {tasks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <CheckCircle className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                      All caught up!
                    </h3>
                    <p className="text-gray-500">No tasks to show.</p>
                  </div>
                )}
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
  );
};

export default AllTasks;
