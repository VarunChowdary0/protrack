'use client'

import { AlertOctagon, EyeIcon, PlusCircle, Upload, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'


const MockResources = [
    {
        name: "Project Plan",
        file: "project_plan.pdf",
    },
    {
        name: "Design Mockups",
        file: "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg",
    },
    {
        name: "User Research Report",
        file: "user_research_report.docx",
    }
];
const Resources:React.FC = () => {
    const [resources,setResources] = useState<{
        name: string;
        file: string;
    }[]>(MockResources);
    const [newResource, setNewResource] = React.useState({
        title: '',
        file: null as File | null,
    });
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Handle the file upload logic here
            setNewResource({
                ...newResource,
                file: file,
            });
            console.log("File selected:", file.name);
        } else {
            console.log("No file selected");
        }
    }; 

    const handleAddResource = () => {
        if (newResource.file) {
            const blobUrl = URL.createObjectURL(newResource.file);
            setResources(prev => [...prev, {
            name: newResource.title,
            file: blobUrl
            }]);
        }
        setNewResource({
            title: '',
            file: null,
        });
    }

    const getFileType = (name:string) => {
        const parts = name.split(".");
        const n = parts.length;
        return parts[n-1]
    }
  return (
    <div className=' grid grid-cols-2 px-3 max-sm:px-0 max-md:grid-cols-1 w-full  gap-5'>        
        <Dialog >
            <DialogTrigger className=' flex items-center max-md:w-full !h-full '>
                <Card className=' max-sm:mx-6 !border-dashed border-2 flex items-center justify-center
                 w-full h-full border-pr hover:cursor-pointer transition-all 
                 hover:border-gray-400/30'>
                    <CardContent className='h-full flex items-center justify-center'>
                        <div className=' hover:cursor-pointer flex gap-3 text-xl font-semibold'>
                            <span>
                                <PlusCircle 
                                    size={24}
                                    className=' text-muted-foreground'/>
                            </span>
                            <span>
                                Add Resource
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className=' max-sm:bg-secondary'>
                <DialogHeader>
                <DialogTitle className=' mb-4'>Are you absolutely sure?</DialogTitle>
                <div className=' flex flex-col gap-2 max-sm:gap-6'>
                    <div className=''>
                        <Label className=' mb-1 max-sm:mb-3' htmlFor='resource_id'>Title / File Name</Label>
                        <Input 
                            value={newResource.title}
                            id='resource_id'
                            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                            placeholder='Enter resource title or file name'
                        />
                    </div>
                    {
                        newResource.file ?

                            <Card>
                                <CardHeader>
                                    <h3 className='text-lg font-semibold'>{newResource.file.name}</h3>
                                    <Badge variant={'secondary'}>
                                        {newResource.file.type}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className=' w-full relative p-3 max-h-[200px] min-h-[100px] flex items-center
                                     justify-center rounded-md border-dashed border-2'>
                                        <Button 
                                            onClick={() => setNewResource(prev => ({...prev, file: null}))}
                                            className=' rounded-full absolute !p-2 h-6 w-6 top-2 right-2'>
                                            <XIcon/>
                                        </Button>
                                        {
                                            newResource.file.type.startsWith('image/') ?
                                            <Image
                                                src={URL.createObjectURL(newResource.file)}
                                                alt={newResource.file.name}
                                                width={200}
                                                height={200}
                                                className='rounded-lg object-fit'
                                            />
                                            :
                                            <div className=' flex items-center justify-center h-full'>
                                                <span className=' text-muted-foreground'>Preview not available</span>
                                            </div>
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                            :
                            <div
                                className="border-2 border-dashed border-pr rounded-lg p-8 text-center hover:border-gray-400/30 transition-all cursor-pointer group"
                                onClick={() =>{
                                        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
                                        if (fileInput) {
                                            fileInput.click();
                                        }
                                    }
                                }
                                >
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/jpg,image/png,image/jpeg,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="p-3 bg-primary rounded-full group-hover:bg-primary/90 transition-colors">
                                        <Upload className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div>
                                    <p className="text-sm text-accent-foreground">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PNG, JPG, PDF, or DOCX files (max 5MB)
                                    </p>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        onClick={handleAddResource} 
                        disabled={!(newResource.file !== null && newResource.title.trim().length > 0)}>
                            Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <Card className=' w-full max-sm:shadow-none max-sm:!border-none'>
            <CardHeader>
                <h2 className='text-lg font-semibold'>Resources</h2>
                <p className='text-sm text-muted-foreground'>Manage your project resources here.</p>
            </CardHeader>
            <CardContent>
                {
                    resources.length > 0 ? (
                        <div className=' flex flex-wrap gap-4'>
                            {
                                resources.map((resource, index) => (
                                    <Card key={index} className=' min-w-[200px] flex-1 gap-2'>
                                        <CardHeader>
                                            <h3 className='text-sm font-semibold '>{resource.name}</h3>
                                            <Badge className=' uppercase !max-w-[100px] !truncate' variant={'secondary'}>{getFileType(resource.file)}</Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <span className='text-xs text-muted-foreground truncate line-clamp-2 text-nowrap'>File: {resource.file}</span>
                                            {
                                                (getFileType(resource.file) !== "pdf" && getFileType(resource.file) !== "docx") &&
                                                <Dialog>
                                                    <DialogTrigger className=' mt-2 flex items-end w-full justify-end'>
                                                        <Button variant={"secondary"} size={'icon'}>
                                                            <EyeIcon/>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{resource.name}</DialogTitle>
                                                        </DialogHeader>
                                                        <div className='mt-3 flex items-center justify-center w-full'>
                                                            <Image
                                                                src={resource.file}
                                                                alt={resource.name}
                                                                height={300}
                                                                width={300}
                                                                className='w-full max-w-[90vw] md:max-w-[600px] rounded-md h-auto object-contain'
                                                            />
                                                        </div> 
                                                    </DialogContent>
                                                </Dialog>
                                            }
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
                            Currently there are no Resources here. Please add back new Resources.
                        </AlertDescription>
                    </Alert>
                }
            </CardContent>
        </Card>
    </div>
  )
}

export default Resources