import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import ReviewCard from './ReviewCard';
import { Check, CheckCheck, TimerIcon } from 'lucide-react';

const ProjectTimeLine = () => {
  type ReviewStatus = "Completed" | "Active" | "Pending";
  
  // Sample project review data
  const projectReviews: Array<{
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    totalForms: number;
    submittedForms: number;
    isActive: boolean;
    status: ReviewStatus;
  }> = [
    {
      id: 1,
      title: "Q1 Review - Foundation Phase",
      startDate: "2024-01-15",
      endDate: "2024-03-31",
      totalForms: 12,
      submittedForms: 12,
      isActive: false,
      status: "Completed"
    },
    {
      id: 2,
      title: "Q2 Review - Problem Statement Phase",
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      totalForms: 18,
      submittedForms: 15,
      isActive: false,
      status: "Completed"
    },
    {
      id: 3,
      title: "Q3 Review - Leterature Review Phase",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      totalForms: 15,
      submittedForms: 8,
      isActive: true,
      status: "Active"
    },
    {
      id: 4,
      title: "Q4 Review - Implementation Phase",
      startDate: "2024-10-01",
      endDate: "2024-12-31",
      totalForms: 10,
      submittedForms: 0,
      isActive: false,
      status: "Pending"
    },
    {
      id: 5,
      title: "Q4 Review - Testing Phase",
      startDate: "2024-12-01",
      endDate: "2025-01-01",
      totalForms: 10,
      submittedForms: 0,
      isActive: false,
      status: "Pending"
    }
  ];

  const formatDate = (dateString:string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status:string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressPercentage = (submitted:number, total:number) => {
    return total > 0 ? Math.round((submitted / total) * 100) : 0;
  };

  return (
    <div className='w-full max-w-5xl flex flex-col'>
      <Card className=' max-sm:shadow-none max-sm:!border-none'>
        <CardHeader className=' max-sm:!gap-0'>
          <h2 className='text-lg font-semibold'>Project Timeline</h2>
          <p className='text-sm text-muted-foreground'>Track your project progress through review phases.</p>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            {/* Vertical Timeline Line */}
            <div className='absolute left-1/2  max-sm:left-0 transform -translate-x-1/2 w-1 h-full bg-teal-200'></div>
            
            {/* Timeline Items */}
            <div className='space-y-8'>
              {projectReviews.map((review, index) => (
                <div key={review.id} className='relative flex items-center'>
                  {/* Timeline Dot */}
                  <div className={`absolute left-1/2 max-sm:left-0 transform -translate-x-1/2 p-5 max-sm:p-3 rounded-full border-4 z-10 bg-white`}>
                    {
                        review.status === 'Completed'?
                        <Check className=' text-green-600' size={18}/>
                        :
                        <TimerIcon className=' text-orange-600' size={18}/>
                    }
                  </div>
                  
                  {/* Card - Alternating sides */}
                  <div className={`w-5/12 max-sm:hidden ${index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}>
                    <Card className={`${review.isActive ? 'ring-2 ring-teal-500 shadow-lg' : 'shadow-md'} hover:shadow-lg transition-shadow`}>
                      <CardHeader className='pb-3'>
                        <div className='flex items-center justify-between'>
                          <h3 className='font-semibold text-base'>{review.title}</h3>
                          { review.status === 'Completed' &&
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
                            {review.status}
                          </span>}
                        </div>
                        <div className='text-sm flex items-center gap-3 text-muted-foreground'>
                          {formatDate(review.startDate)} - {formatDate(review.endDate)}
                            <span  className=' text-amber-400'>
                                <CheckCheck size={16}/>
                            </span>
                        </div>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <div className='space-y-3'>
                          {/* Forms Progress */}
                          <div>
                            <div className='flex justify-between text-sm mb-1'>
                              <span>Forms Progress</span>
                              <span className='font-medium'>{review.submittedForms}/{review.totalForms}</span>
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-2'>
                              <div 
                                className={`h-2 rounded-full ${
                                  review.status === 'Completed' 
                                    ? 'bg-green-500' 
                                    : review.isActive 
                                      ? 'bg-teal-500' 
                                      : 'bg-gray-400'
                                }`}
                                style={{ width: `${getProgressPercentage(review.submittedForms, review.totalForms)}%` }}
                              >
                                
                              </div>
                            </div>
                            <div className='text-xs text-muted-foreground mt-1'>
                              {getProgressPercentage(review.submittedForms, review.totalForms)}% Complete
                            </div>
                          </div>
                          
                          {/* Status Indicator */}
                          <div className='flex items-center space-x-2 text-sm'>
                            <div className={`w-2 h-2 rounded-full ${
                              review.isActive 
                                ? 'bg-teal-500' 
                                : review.status === 'Completed' 
                                  ? 'bg-green-500'
                                  : 'bg-gray-400'
                            }`}></div>
                            <span className={review.isActive ? 'text-teal-700 font-medium' : 'text-muted-foreground'}>
                              {review.isActive ? 'Currently Active' : review.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                    <ReviewCard {...review} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectTimeLine