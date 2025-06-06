import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertOctagon, BirdIcon, Calendar, MapPin } from 'lucide-react'

const mockUpcomingActivities = [
    {
      title: "Project Kickoff Meeting",
      date: "2023-10-01",
      description: "Kickoff meeting for the new project with all team members.",
      location: "Conference Room A"
    },

    {
      title: "Design Review",
      date: "2023-10-05",
      description: "Review the design mockups with the design team.",
      location: "Online (Zoom)"
    },
    {
      title: "Sprint Planning",
      date: "2023-10-10",
      description: "Plan the tasks for the upcoming sprint with the development team.",
      location: "Conference Room B"
    }
];
const UpCommingActivities:React.FC = () => {
  return (
    <Card className='w-full max-w-4xl snap-start'>
        <CardHeader>
            <h2 className='text-lg font-semibold'>Upcoming Activities</h2>
            <p className='text-sm text-muted-foreground'>Stay updated with the upcoming activities.</p>
        </CardHeader>
        <CardContent>
            {
                mockUpcomingActivities.length > 0 ? (
                    <div className=' grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4'>
                    {
                        mockUpcomingActivities.map((activity, index) => (
                            <Card key={index} className=' gap-2'>
                                <CardHeader>
                                    <BirdIcon className='text-sky-400 h-6 w-6 ' />
                                    <CardTitle>{activity.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-sm text-muted-foreground'>{activity.description}</p>
                                    <div className='mt-2 flex w-full justify-between items-center gap-2'>
                                        <span className='text-xs flex items-center justify-around gap-1 text-muted-foreground'>
                                            <Calendar size={12}/>
                                            {new Date(activity.date).toLocaleDateString()}
                                        </span>
                                        <span className='text-xs flex items-center justify-around gap-1 text-muted-foreground'>
                                            <MapPin size={12}/>
                                            {activity.location}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }

                    </div>
                ) : 
                <Alert variant="default">
                    <AlertOctagon />
                    <AlertTitle>None</AlertTitle>
                    <AlertDescription>
                        Currently there are no upcoming activities scheduled. Please check back later for updates.
                    </AlertDescription>
                </Alert>
            }
        </CardContent>
    </Card>
  )
}

export default UpCommingActivities