import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GithubIcon, Link2, MapPin } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const DescriptionCard = () => {
  const project = useSelector((state: RootState) => state.selectedProject.project);
  return (
    <Card className='w-fit h-fit max-sm:shadow-none max-sm:!border-none'>
        <CardHeader style={{
          zIndex: 1000
        }} className=' dark:bg-primary-foreground max-sm:py-3 max-sm:pt-4 max-sm:!gap-0 sticky max-sm:top-0'>
          <h2 className='text-2xl font-bold'>Dashboard</h2>
          <p className='text-sm text-muted-foreground'>Welcome to your dashboard!</p>
        </CardHeader>
        <CardContent>
            <div className=' flex flex-wrap max-md:justify-center gap-10 max-sm:gap-0'>
              <div className=' flex flex-col items-center justify-center space-y-4'>
                <Image
                  src={"/placeholder.png"}
                  alt="Dashboard Image"
                  width={200}
                  height={200}
                  className='rounded-full border shadow-lg'
                />
                <h1 className=' text-lg font-semibold'>{project?.name}</h1>
                <Badge>{project?.domain}</Badge>
              </div>
              <div className=' hidden max-sm:block bg-secondary w-full h-0.5 my-5'></div>
              <Card className=' max-sm:!pt-0 relative max-sm:px-0 !shadow-none !border-0'>
                <CardContent className='  max-sm:!py-0 flex flex-col space-y-3 max-sm:px-0 p-4'>
                  <div>
                    <h3 className=' text-lg font-semibold'>Problem Statement</h3>
                    <p className=' text-sm max-w-2xl text-muted-foreground'>
                      {project?.problemStatement || "No problem statement provided."}
                    </p>
                  </div>
                  <table >
                    <tbody>
                        <tr >
                        <td className=' pr-10 max-sm:text-xs'>Project Code</td>
                          <td className=' pr-10 '>
                              <Badge className=' bg-blue-500 text-white'>{project?.code}</Badge>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  <div className='  flex  gap-5'>
                    <div className=' flex items-center'>
                      <Link2 size={16}/>
                      <a href={project?.site_link} className=' text-muted-foreground text-sm hover:underline ml-2'>
                        Website
                      </a>
                    </div>
                    <div className=' flex items-center'>
                      <GithubIcon size={16}/>
                      <a href={project?.repositoryLink} className=' text-muted-foreground text-sm hover:underline ml-2'>
                        Repository
                      </a>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className=' max-sm:p-0 max-sm:mt-2 absolute bottom-0 px-4 py-3 max-sm:left-0 right-0'>
                  <div className=' flex gap-2 justify-between items-center'>
                    <MapPin size={16}/>
                    <span className=' text-sm max-sm:text-xs text-muted-foreground'>{project?.location}</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
        </CardContent>
    </Card>
  )
}

export default DescriptionCard