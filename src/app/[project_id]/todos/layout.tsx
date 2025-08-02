"use client";

import React, { useEffect, useState } from 'react';
import { Star, Calendar, Users, User, List, GripIcon, ReplyIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addTask, fetchTasks } from '@/redux/reducers/TasksReducer';
import AddNewTask from '@/components/todos/AddNewTask';

const tabs = [
    { id: 'all', label: 'All', icon: List },
    { id: 'important', label: 'Important', icon: Star },
    { id: 'planned', label: 'Planned', icon: Calendar },
    { id: 'assigned', label: 'Assigned', icon: Users },
    { id: 'my-tasks', label: 'My Tasks', icon: User },
];

interface TodosLayoutProps {
  children?: React.ReactNode;
}

export default function TodosLayout({ children }: TodosLayoutProps) {
    const path = usePathname();
    const {project_id} = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const user_id = useSelector((state:RootState)=> state.auth.user?.id); 
    const participants = useSelector((state:RootState)=> state.selectedProject.project?.participants); 
    const [activeTab, setActiveTab] = useState('all');
    const [isOpen, setIsOpen] = useState(false);
    React.useEffect(() => {
        setIsOpen(false);
    },[activeTab]);

    const taskStore = useSelector((state:RootState)=> state.tasks)

    useEffect(() => {
        if(path.endsWith("important")){
            setActiveTab('important');
        }
        else if(path.endsWith("planned")){
            setActiveTab('planned');
        }
        else if(path.endsWith("assigned")){
            setActiveTab('assigned');
        }
        else if(path.endsWith("my-tasks")){
            setActiveTab('my-tasks');
        }
        else{
            setActiveTab('all');
        }
    },[path]);

    useEffect(()=>{
        if(participants){
            console.log("Tasks loading...")
            dispatch(fetchTasks({
                projectId: project_id?.toLocaleString() || "",
                participantId: participants?.find((parti) => parti.userId === user_id)?.id || ''
            }));
        }
    },[user_id,participants])

  return (
    <>
      <div className=' fixed bottom-0 pb-5 max-sm:pb-20 right-4'>
                <AddNewTask setTasks={(new_) => {
                        dispatch(addTask(new_));
                    }}
                />
            </div>
        <div className="flex max-sm:hidden flex-col h-full bg-background">
            {/* Navigation Header */}
            <div style={{
                zIndex: 1000
            }} className="border-b sticky top-0 border-border bg-card">
                <div className="flex items-center space-x-1 p-4">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                        <Link href={`/${project_id}/todos/`+tab.id}
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                        </Link>
                        );
                    })}
                </div>
            </div>
            {/* Content Area */}
            {
                taskStore.isLoaded ?
                    taskStore.error ? 
                    <div className=' flex w-full h-[80vh] items-center justify-center'>
                       {taskStore.error}
                    </div>
                     :
                        <div className="flex-1  overflow-y-auto">
                            {children || (
                            <div className="p-6 ">
                                <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon || List, {
                                    className: "h-8 w-8 text-muted-foreground"
                                    })}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {tabs.find(tab => tab.id === activeTab)?.label} Tasks
                                </h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    {activeTab === 'important' && "Focus on your most critical tasks and priorities."}
                                    {activeTab === 'planned' && "Review tasks scheduled for specific dates and times."}
                                    {activeTab === 'assigned' && "Manage tasks that have been assigned to team members."}
                                    {activeTab === 'my-tasks' && "View all tasks assigned specifically to you."}
                                    {activeTab === 'all' && "See all your tasks in one comprehensive view."}
                                </p>
                                </div>
                            </div>
                            )}
                        </div>
                :
                <div className=' flex w-full h-[80vh] items-center justify-center'>
                    <Loader2 className=' animate-spin'/>
                </div>
              
            }
        </div>

        <div className="max-sm:flex hidden h-screen bg-background">
        {/* Navigation Header */}
            <div onClick={()=>{
                setIsOpen(!isOpen);
            }} className=' bg-secondary rounded-md p-2 absolute top-5 left-3'>
                { !isOpen ? <GripIcon className='rotate-180'/> : <ReplyIcon/>}
            </div>

            <div style={{
                zIndex: 1000,
            }} className={` ${isOpen ? "" : " -translate-x-200"} duration-200 fixed left-0 top-0 bottom-0 transition-all 
             flex border-b h-screen border-border `}>
                <div className="flex py-10 flex-col h-fit rounded-full shadow-2xl bg-card space-y-4">
                    <div className=' font-bold flex items-center justify-center w-full'>
                        <span className=' text-rose-500'>T</span>
                        <span className=' '>odo</span>
                    </div>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <Link href={tab.id} key={tab.id} className=' w-full'>
                                <Button
                                    key={tab.id}
                                    variant={'link'}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex justify-between flex-1 space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors mx-2 ${
                                    activeTab === tab.id
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className=' text-xs'>{tab.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </div>
                <div 
                style={{
                    zIndex: 1000,
                }}
             onClick={()=>setIsOpen(false)} className='  w-[80vw] flex-1 '></div>
            </div>

            {/* Content Area */}
            {
                taskStore.isLoaded ?
                   taskStore.error ? 
                    <div className=' flex w-full h-[80vh] items-center justify-center'>
                       {taskStore.error}
                    </div>
                    :
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                :
                <div className=' flex w-full h-full items-center justify-center'>
                    <Loader2 className=' animate-spin'/>
                </div>
            }
        </div>
    </>
  );
}