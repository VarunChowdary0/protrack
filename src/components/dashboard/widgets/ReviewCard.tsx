import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Timeline, TimelineEventType } from '@/types/timelineType';
import { CheckCircle, TimerIcon, Clock, Check } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const TimeLineCard: React.FC<Partial<Timeline>> = (phase) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: TimelineEventType | undefined) => {
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

  const getProgressPercentage = (verified: number | undefined, total: number | undefined) => {
    const verifiedCount = verified || 0;
    const totalCount = total || 0;
    return totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;
  };

  const getStatusIcon = (status: TimelineEventType | undefined) => {
    switch (status) {
      case TimelineEventType.COMPLETED:
        return <CheckCircle className="text-green-600" size={16} />;
      case TimelineEventType.ACTIVE:
        return <TimerIcon className="text-blue-600" size={16} />;
      case TimelineEventType.PENDING:
        return <Clock className="text-yellow-600" size={16} />;
      case TimelineEventType.CANCELLED:
        return <Check className="text-red-600" size={16} />;
      case TimelineEventType.POSTPONED:
        return <Clock className="text-orange-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const isActive = phase.status === TimelineEventType.ACTIVE;
  const progressPercentage = getProgressPercentage(phase.verifiedDocuments, phase.totalDocuments);

  return (
    <Link href={`phase/${phase.id}`}>
      <Card className={`${isActive ? 'ring-2 ring-teal-500 shadow-lg' : 'shadow-md'} w-full hover:shadow-lg
      hidden max-sm:block transition-shadow ml-10`}>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-base'>{phase.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(phase.status)}`}>
              {phase.status}
            </span>
          </div>
          <div className='text-sm flex items-center gap-3 text-muted-foreground'>
            <span>{formatDate(phase.startDate)} - {formatDate(phase.endDate)}</span>
            {isActive && (
              <span className='text-teal-500'>
                {getStatusIcon(phase.status)}
              </span>
            )}
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
              <p className='text-sm text-muted-foreground line-clamp-2'>
                {phase.description}
              </p>
            )}

            {/* Remarks */}
            {phase.remarks && (
              <div className='text-sm p-2 bg-gray-50 rounded'>
                <span className='font-medium'>Remarks: </span>
                <span className='text-muted-foreground'>{phase.remarks}</span>
              </div>
            )}

            {/* Document Submissions Summary */}
            {phase.documentSubmissions && phase.documentSubmissions.length > 0 && (
              <div className='text-xs text-muted-foreground'>
                {phase.documentSubmissions.filter(sub => sub.status === 'APPROVED').length} approved, {' '}
                {phase.documentSubmissions.filter(sub => sub.status === 'PENDING').length} pending, {' '}
                {phase.documentSubmissions.filter(sub => sub.status === 'REJECTED').length} rejected
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default TimeLineCard