"use client"

import CommonTasks from '@/components/todos/CommonTasks'
import { RootState } from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';

const Page:React.FC = () => {
  const tasks = useSelector((state:RootState)=> state.tasks.tasks);
  return (
    <CommonTasks
      tasks={tasks
        .slice()
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .filter(task => task.assignedBy_id !== task.assignedTo_id )
      }
      title='Assigned Tasks'
    />
  )
}

export default Page