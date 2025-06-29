import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import { Check, TimerIcon, Clock, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TimelineEventType } from '@/types/timelineType';
import TimeLineCard from './ReviewCard';
import Link from 'next/link';

const ProjectTimeLine = () => {
  const timelines = useSelector((state: RootState) => state.selectedProject.project?.timelines);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: TimelineEventType) => {
    switch (status) {
      case TimelineEventType.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case TimelineEventType.ACTIVE:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case TimelineEventType.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TimelineEventType.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      case TimelineEventType.POSTPONED:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressPercentage = (verified: number, total: number) => {
    return total > 0 ? Math.round((verified / total) * 100) : 0;
  };

  const getTimelineIcon = (status: TimelineEventType) => {
    switch (status) {
      case TimelineEventType.COMPLETED:
        return <CheckCircle className="text-green-600" size={18} />;
      case TimelineEventType.ACTIVE:
        return <TimerIcon className="text-blue-600" size={18} />;
      case TimelineEventType.PENDING:
        return <Clock className="text-yellow-600" size={18} />;
      case TimelineEventType.CANCELLED:
        return <Check className="text-red-600" size={18} />;
      case TimelineEventType.POSTPONED:
        return <Clock className="text-orange-600" size={18} />;
      default:
        return <Clock className="text-gray-600" size={18} />;
    }
  };

  const isActiveTimeline = (status: TimelineEventType) => {
    return status === TimelineEventType.ACTIVE;
  };

  return (
    <div className='w-full max-w-5xl flex flex-col'>
      <Card className='max-sm:shadow-none max-sm:!border-none'>
        <CardHeader className='max-sm:!gap-0'>
          <h2 className='text-lg font-semibold'>Project Timeline</h2>
          <p className='text-sm text-muted-foreground'>Track your project progress through review phases.</p>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            {/* Vertical Timeline Line */}
            <div className='absolute left-1/2 max-sm:left-0 transform -translate-x-1/2 w-1 h-full bg-teal-200'></div>
            
            {/* Timeline Items */}
            <div className='space-y-8'>
              {timelines ? 
                timelines.map((phase, index) => {
                  const progressPercentage = getProgressPercentage(phase.verifiedDocuments || 0, phase.totalDocuments || 0);
                  const isActive = isActiveTimeline(phase.status || TimelineEventType.PENDING);
                  
                  return (
                    <Link href={`phase/${phase.id}`} key={phase.id} className='relative flex items-center'>
                      {/* Timeline Dot */}
                      <div className={`absolute left-1/2 max-sm:left-0 transform -translate-x-1/2 p-3 rounded-full border-4 z-10 bg-white ${
                        isActive ? 'border-teal-500' : 'border-gray-300'
                      }`}>
                        {getTimelineIcon(phase.status || TimelineEventType.PENDING)}
                      </div>
                      
                      {/* Card - Alternating sides for desktop */}
                      <div className={`w-5/12 max-sm:hidden ${index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}>
                        <Card className={`${isActive ? 'ring-2 ring-teal-500 shadow-lg' : 'shadow-md'} hover:shadow-lg transition-shadow`}>
                          <CardHeader className='pb-3'>
                            <div className='flex items-center justify-between'>
                              <h3 className='font-semibold text-base'>{phase.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(phase.status || TimelineEventType.PENDING)}`}>
                                {phase.status}
                              </span>
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              {phase.startDate && formatDate(phase.startDate)} - {phase.endDate && formatDate(phase.endDate)}
                            </div>
                          </CardHeader>
                          <CardContent className='pt-0'>
                            <div className='space-y-3'>
                              {/* Document Progress */}
                              <div>
                                <div className='flex justify-between text-sm mb-1'>
                                  <span>Document Progress</span>
                                  <span className='font-medium'>{phase.verifiedDocuments || 0}/{phase.totalDocuments || 0}</span>
                                </div>
                                <div className='w-full bg-gray-200 rounded-full h-2'>
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      phase.status === TimelineEventType.COMPLETED 
                                        ? 'bg-green-500' 
                                        : isActive 
                                          ? 'bg-teal-500' 
                                          : 'bg-gray-400'
                                    }`}
                                    style={{ width: `${progressPercentage}%` }}
                                  ></div>
                                </div>
                                <div className='text-xs text-muted-foreground mt-1'>
                                  {progressPercentage}% Complete
                                </div>
                              </div>
                              
                              {/* Status Indicator */}
                              <div className='flex items-center space-x-2 text-sm'>
                                <div className={`w-2 h-2 rounded-full ${
                                  isActive 
                                    ? 'bg-teal-500' 
                                    : phase.status === TimelineEventType.COMPLETED 
                                      ? 'bg-green-500'
                                      : 'bg-gray-400'
                                }`}></div>
                                <span className={isActive ? 'text-teal-700 font-medium' : 'text-muted-foreground'}>
                                  {isActive ? 'Currently Active' : phase.status}
                                </span>
                              </div>

                              {/* Description */}
                              {phase.description && (
                                <p className='text-sm text-muted-foreground'>
                                  {phase.description}
                                </p>
                              )}

                              {/* Remarks */}
                              {phase.remarks && (
                                <div className='text-sm p-2 bg-gray-50 rounded'>
                                  <span className='font-medium'>Remarks: </span>
                                  {phase.remarks}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Mobile Card */}
                      <TimeLineCard {...phase} />
                    </Link>
                  );
                })
                :
                <div className='text-center text-muted-foreground py-10'>
                  No timeline phases available.
                </div>
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectTimeLine