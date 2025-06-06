"use client";

import React, { useEffect } from 'react'
import CalendarWid from './widgets/CalendarWid'
import ImportantDates from './widgets/ImportantDates';
import { useDispatch } from 'react-redux';
import { setChatOpen } from '@/redux/reducers/BooleanReducer';


const mockImportantDates = [
  { id: 1, title: 'Project Kickoff', date: new Date('2025-01-15T09:00:00'), description: 'Initial project kickoff meeting.' },
  { id: 2, title: 'Initial Wireframes Review', date: new Date('2025-01-25T11:00:00'), description: 'Feedback on low-fidelity designs.' },

  { id: 3, title: 'Requirements Review', date: new Date('2025-02-15T14:30:00'), description: 'Detailed requirements review session.' },
  { id: 4, title: 'API Contract Signoff', date: new Date('2025-02-27T10:30:00'), description: 'Finalize backend API contracts.' },

  { id: 5, title: 'Design Workshop', date: new Date('2025-03-15T10:00:00'), description: 'UI/UX design workshop with stakeholders.' },
  { id: 6, title: 'Component Library Demo', date: new Date('2025-03-28T16:00:00'), description: 'Walkthrough of reusable UI components.' },

  { id: 7, title: 'Sprint Planning', date: new Date('2025-04-15T09:30:00'), description: 'First sprint planning meeting.' },
  { id: 8, title: 'Backlog Grooming', date: new Date('2025-04-22T13:00:00'), description: 'Refining user stories for next sprint.' },

  { id: 9, title: 'Architecture Review', date: new Date('2025-05-15T11:00:00'), description: 'Technical architecture review.' },
  { id: 10, title: 'Load Testing Planning', date: new Date('2025-05-29T15:00:00'), description: 'Setup performance testing roadmap.' },

  { id: 11, title: 'Progress Review', date: new Date('2025-06-15T14:00:00'), description: 'Mid-project progress review.' },
  { id: 12, title: 'Bug Bash #1', date: new Date('2025-06-24T10:00:00'), description: 'Team-wide bug bash.' },

  { id: 13, title: 'QA Testing Begins', date: new Date('2025-07-15T09:00:00'), description: 'Start of quality assurance testing phase.' },
  { id: 14, title: 'Internal Demo', date: new Date('2025-07-22T15:30:00'), description: 'Demo for internal stakeholders.' },

  { id: 15, title: 'Beta Release', date: new Date('2025-08-15T16:00:00'), description: 'Beta version release for testing.' },
  { id: 16, title: 'Client Feedback Session', date: new Date('2025-08-28T12:00:00'), description: 'Live feedback from client users.' },

  { id: 17, title: 'User Training', date: new Date('2025-09-15T10:00:00'), description: 'End-user training session.' },
  { id: 18, title: 'Training Materials Finalization', date: new Date('2025-09-27T14:00:00'), description: 'Prepare guides, videos, and help docs.' },

  { id: 19, title: 'Security Audit', date: new Date('2025-10-15T13:00:00'), description: 'Security assessment and audit.' },
  { id: 20, title: 'Code Freeze', date: new Date('2025-10-30T18:00:00'), description: 'All code changes frozen before release.' },

  { id: 21, title: 'Performance Testing', date: new Date('2025-11-15T11:00:00'), description: 'System performance evaluation.' },
  { id: 22, title: 'Regression Testing', date: new Date('2025-11-25T10:30:00'), description: 'Final regression pass before handover.' },

  { id: 23, title: 'Final Review', date: new Date('2025-12-15T14:30:00'), description: 'Final project review meeting.' },
  { id: 24, title: 'Postmortem & Retrospective', date: new Date('2025-12-20T16:00:00'), description: 'Team retrospective and lessons learned.' },
  { id: 25, title: 'Documentation Handover', date: new Date('2025-12-30T09:00:00'), description: 'Deliver technical and user documentation.' }
];

const dates = mockImportantDates.map(event => event.date);


const MainCalendar = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setChatOpen(false));
    },[])
  return (
        <div className=' flex h-full gap-10 flex-col snap-mandatory snap-y p-10 max-sm:p-0
         items-center py-20 max-sm:py-15'>
            <CalendarWid importantDates={dates}/>
            <ImportantDates data={mockImportantDates}/>
        </div>
  )
}

export default MainCalendar