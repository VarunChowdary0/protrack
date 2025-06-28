import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CalendarClock, MessagesSquareIcon, PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'



const Members = () => {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const project = useSelector((state: RootState) => state.selectedProject.project);

  console.log(auth.user?.id, project?.creator_id);
  return (
      <div className=' w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5'>
        <Card className=' max-sm:shadow-none max-sm:!border-none'>
          <CardHeader className=' max-sm:!gap-0'>
            <h2 className='text-lg font-semibold'>Team Members</h2>
            <p className='text-sm text-muted-foreground'>Meet your team members.</p>
          </CardHeader>
          <CardContent>
            <div className=' flex flex-col gap-2.5 divide-y'>
              {project?.participants &&
                project?.participants.filter((x=> x.isTeamMember)).map((member, index) => (
                  <div key={index} className=' max-sm:pr-5 flex gap-3 min-w-[280px] pb-2.5 items-center justify-between'>
                    <div className='flex gap-3 items-center'>
                     <Avatar>
                        <AvatarImage src={member.user?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className=' flex flex-col'>
                        <span className=' text-sm capitalize'>{member.user?.firstname}  {member.user?.lastname}</span>
                        {
                          member.role && member.role.trim().length > 0 &&
                          <span className=' text-muted-foreground capitalize text-xs'>{member.role.replaceAll("_"," ")}</span>
                        }
                      </div>
                    </div>
                    <div>
                      <MessagesSquareIcon size={16} className=' text-muted-foreground hover:text-blue-500 cursor-pointer' />
                    </div>
                  </div>
                ))
              }
            </div>
            { (auth.user?.id === project?.creator_id) &&
              <div className=' w-full flex items-center justify-center'>
              <Button onClick={()=>  router.push(`/${project?.id}/manage-participants`)}> 
                <PlusCircle size={16} className=' text-green-600 cursor-pointer' />
                Add Member
              </Button>
            </div>}
          </CardContent>
        </Card>

        <Card className=' max-sm:shadow-none max-sm:!border-none'>
          <CardHeader className=' max-sm:!gap-0'>
            <h2 className='text-lg font-semibold'>Supervisors</h2>
              <p className='text-sm text-muted-foreground'>Meet your project Supervisors and guides.</p>
          </CardHeader>
          <CardContent>
            <div className=' flex flex-col gap-2.5 divide-y'>
              {project?.participants &&
                project?.participants.filter((x=> !x.isTeamMember)).map((member, index) => (
                  <div key={index} className='max-sm:pr-5 flex gap-3 min-w-[280px] pb-2.5 items-center justify-between'>

                    <div className='flex gap-3 items-center'>
                      <Avatar>
                        <AvatarImage src={member.user?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className=' flex flex-col'>
                        <span className=' text-sm capitalize'>{member.user?.firstname}  {member.user?.lastname}</span>
                        {
                          member.role && member.role.trim().length > 0 &&
                          <span className=' text-muted-foreground capitalize text-xs'>{member.role.replaceAll("_"," ")}</span>
                        }
                      </div>
                    </div>
                    <div className=' flex gap-3'>
                      <CalendarClock size={16} className=' text-muted-foreground hover:text-amber-500 cursor-pointer' />
                      <MessagesSquareIcon size={16} className=' text-muted-foreground hover:text-blue-500 cursor-pointer' />
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

export default Members