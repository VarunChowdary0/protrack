"use client"
import CommonTasks from '@/components/todos/CommonTasks'
// import { mockTasks } from '@/components/todos/MockData'
import { RootState } from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';

const Page:React.FC = () => {
  const user_id = useSelector((state:RootState)=> state.auth.user?.id); 
  const participants = useSelector((state:RootState)=> state.selectedProject.project?.participants);
  const myParticipantId = participants?.find((parti) => parti.userId === user_id)?.id; 
  const tasks = useSelector((state:RootState)=> state.tasks.tasks);
  return (
    <CommonTasks
      tasks={tasks
        .slice()
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .filter(task => task.assignedBy_id ===  myParticipantId)}
      title="My Tasks"
    />

  )
}

export default Page