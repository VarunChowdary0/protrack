import CommonTasks from '@/components/todos/CommonTasks'
import { mockTasks } from '@/components/todos/MockData'
import React from 'react'

const page = () => {
  return (
    <CommonTasks
      tasks={mockTasks
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .filter(task => task.assignedBy_id !== task.assignedTo_id )
      }
      title='Important Tasks'
    />
  )
}

export default page