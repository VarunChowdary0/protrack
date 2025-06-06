import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GithubIcon, Link2, MapPin } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const DescriptionCard = () => {
  return (
    <Card className='w-fit h-fit max-sm:shadow-none max-sm:!border-none'>
        <CardHeader style={{
          zIndex: 1000
        }} className=' bg-primary-foreground max-sm:py-3 max-sm:pt-4 max-sm:!gap-0 sticky max-sm:top-0'>
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
                <h1 className=' text-lg font-semibold'>Handwritten to Digital text</h1>
                <Badge>Machine Learning</Badge>
              </div>
              <div className=' hidden max-sm:block bg-secondary w-full h-0.5 my-5'></div>
              <Card className=' max-sm:!pt-0 relative !shadow-none !border-0'>
                <CardContent className=' max-sm:!pt-0 flex flex-col space-y-3 p-4'>
                  <div>
                    <h3 className=' text-lg font-semibold'>Problem Statement</h3>
                    <p className=' text-sm max-w-2xl text-muted-foreground'>Traditional methods of digitizing documents, such as manual transcription, are time-consuming,
costly, and prone to errors. Despite advancements in digital document storage, many
organizations still rely on paper-based records, leading to inefficiencies in data extraction and
retrieval. Existing OCR systems, while effective in some cases, often struggle with.</p>
                  </div>
                  <table >
                    <tbody>
                        <tr >
                        <td className=' pr-10'>Course Code</td>
                        <td className=' pr-10 max-sm:text-xs'>
                            <Badge className=' bg-blue-500 text-white'>CDCAA1</Badge>
                        </td>
                        </tr>
                        <tr className=''>
                        <td className=' pt-2 pr-10 max-sm:text-xs'>Course Name</td>
                        <td className=' pt-2 pr-10'>
                            <Badge className=' bg-amber-500 text-white'>Major Project</Badge>
                        </td>
                        </tr>
                    </tbody>
                  </table>
                  <div className='  flex  gap-5'>
                    <div className=' flex items-center'>
                      <Link2 size={16}/>
                      <a href="" className=' text-muted-foreground text-sm hover:underline ml-2'>
                        Website
                      </a>
                    </div>
                    <div className=' flex items-center'>
                      <GithubIcon size={16}/>
                      <a href="" className=' text-muted-foreground text-sm hover:underline ml-2'>
                        Repository
                      </a>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className=' absolute bottom-0 px-4 py-3 max-sm:left-0 right-0'>
                  <div className=' flex gap-2 justify-between items-center'>
                    <MapPin size={16}/>
                    <span className=' text-sm max-sm:text-xs text-muted-foreground'>Institute of Aeronautical Engineering</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
        </CardContent>
    </Card>
  )
}

export default DescriptionCard