import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCheck } from 'lucide-react';
import React from 'react'

interface Review {
    id?: number;
  title: string;
    status: 'Active' | 'Completed' | 'Pending' ;
    startDate: string;
    endDate: string;
    submittedForms: number;
    totalForms: number;
    isActive: boolean;
}
const ReviewCard:React.FC<Review> = (review) => {


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
    <Card className={`${review.isActive ? ' ring-2 ring-teal-500 shadow-lg' : 'shadow-md '} w-full hover:shadow-lg
    hidden max-sm:block transition-shadow ml-10`}>
        <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-base'>{review.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
            {review.status}
            </span>
        </div>
        <div className='text-sm text-muted-foreground'>
            {formatDate(review.startDate)} - {formatDate(review.endDate)}
             <div className='text-sm flex items-center gap-3 text-muted-foreground'>
                {formatDate(review.startDate)} - {formatDate(review.endDate)}
                { review.status === "Completed" && <span  className=' text-amber-400'>
                    <CheckCheck size={16}/>
                </span>}
            </div>
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
                ></div>
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
  )
}

export default ReviewCard