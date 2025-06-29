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
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import axiosInstance from '@/config/AxiosConfig'
import { updateProject } from '@/redux/reducers/SelectedProject'
import { Tooltip,TooltipContent,TooltipTrigger } from '@/components/ui/tooltip'

const Resources: React.FC = () => {
  const project = useSelector((state: RootState) => state.selectedProject)
  const user = useSelector((state: RootState) => state.auth.user)
  const resources = project.project?.resources || []
  const dispatch = useDispatch<AppDispatch>();

  const myParticipantId = project.project?.participants?.find(p => p.userId === user?.id)?.id

  const [newResource, setNewResource] = useState({
    title: '',
    file: null as File | null,
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewResource({
        ...newResource,
        file: file,
      })
    }
  }

  const getFileType = (name: string) => {
    const parts = name.split('.')
    return parts[parts.length - 1].toLowerCase()
  }

  const handleAddResource = async () => {
    if (!project.project?.id || !newResource.file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('projectId', project.project.id)
    formData.append('name', newResource.title)
    formData.append('description', newResource.title)
    formData.append('fileType', getFileType(newResource.file.name))
    formData.append('file', newResource.file)

    try {
      const res = await axiosInstance.post('/api/project/add/resource', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log("Upload success:", res.data)
      dispatch(updateProject({
          ...project.project,
          resources: [...resources, res.data]
        }))
    setNewResource({ title: '', file: null })
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='grid grid-cols-2 px-3 max-sm:px-0 max-md:grid-cols-1 w-full gap-5'>
      {/* Upload Resource Dialog */}
      <Dialog>
        <DialogTrigger className='flex items-center max-md:w-full !h-full'>
          <Card className='max-sm:mx-6 !border-dashed border-2 flex items-center justify-center w-full h-full border-pr hover:cursor-pointer transition-all hover:border-gray-400/30'>
            <CardContent className='h-full flex items-center justify-center'>
              <div className='flex gap-3 text-xl font-semibold'>
                <PlusCircle size={24} className='text-muted-foreground' />
                <span>Add Resource</span>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className='max-sm:bg-secondary'>
          <DialogHeader>
            <DialogTitle className='mb-4'>Add a New Resource</DialogTitle>
            <div className='flex flex-col gap-2 max-sm:gap-6'>
              {/* Title Input */}
              <div>
                <Label className='mb-1 max-sm:mb-3' htmlFor='resource_id'>Title / File Name</Label>
                <Input
                  value={newResource.title}
                  id='resource_id'
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder='Enter resource title or file name'
                />
              </div>

              {/* File Preview or Upload */}
              {newResource.file ? (
                <Card>
                  <CardHeader>
                    <h3 className='text-lg font-semibold'>{newResource.file.name}</h3>
                    <Badge variant='secondary'>{newResource.file.type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className='w-full relative p-3 max-h-[200px] min-h-[100px] flex items-center justify-center rounded-md border-dashed border-2'>
                      <Button onClick={() => setNewResource(prev => ({ ...prev, file: null }))} className='rounded-full absolute !p-2 h-6 w-6 top-2 right-2'>
                        <XIcon />
                      </Button>
                      {newResource.file.type.startsWith('image/') ? (
                        <Image
                          src={URL.createObjectURL(newResource.file)}
                          alt={newResource.file.name}
                          width={200}
                          height={200}
                          className='rounded-lg object-fit'
                        />
                      ) : (
                        <span className='text-muted-foreground'>Preview not available</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div
                  className="border-2 border-dashed border-pr rounded-lg p-8 text-center hover:border-gray-400/30 transition-all cursor-pointer group"
                  onClick={() => {
                    const fileInput = document.getElementById("file-upload") as HTMLInputElement
                    fileInput?.click()
                  }}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,.pdf,.docx"
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
              )}
            </div>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={handleAddResource}
              disabled={isUploading || !(newResource.file && newResource.title.trim())}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource List */}
      <Card className='w-full max-sm:shadow-none max-sm:!border-none'>
        <CardHeader>
          <h2 className='text-lg font-semibold'>Resources</h2>
          <p className='text-sm text-muted-foreground'>Manage your project resources here.</p>
        </CardHeader>
        <CardContent>
          {resources.length > 0 ? (
            <div className='flex flex-wrap gap-4'>
              {resources.map((resource, index) => (
                <Card key={index} className=' relative min-w-[200px] flex-1 gap-2'>
                  <CardHeader>
                    { resource?.ownerId === myParticipantId &&
                        <Tooltip>
                            <TooltipTrigger className='absolute top-3 right-3'>
                                <div className=' rounded-full bg-green-600 p-1  top-3 right-3'>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className='text-xs'>You are the owner</span>
                            </TooltipContent>
                        </Tooltip>
                    }
                    <h3 className='text-sm font-semibold'>{resource.document?.name || 'Untitled'}</h3>
                    <Badge className='uppercase !max-w-[100px] !truncate' variant='secondary'>
                      {getFileType(resource.document?.filePath || "")}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <span className='text-xs text-muted-foreground truncate line-clamp-2 text-nowrap'>
                      File: {resource.document?.filePath}
                    </span>

                    {/* Image Preview or Open Link */}
                    {["jpg", "jpeg", "png", "webp"].includes(getFileType(resource.document?.filePath || '')) ? (
                      <Dialog>
                        <DialogTrigger className='mt-2 flex items-end w-full justify-end'>
                          <Button variant="secondary" size="icon">
                            <EyeIcon />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-sm:bg-secondary'>
                          <DialogHeader>
                            <DialogTitle>{resource.document?.name}</DialogTitle>
                          </DialogHeader>
                          <div className='mt-3 flex items-center justify-center w-full'>
                            <Image
                              src={resource.document?.filePath || "/placeholder.png"}
                              alt={resource.document?.name || "Resource Image"}
                              height={300}
                              width={300}
                              className='w-full max-w-[90vw] md:max-w-[600px] rounded-md h-auto object-contain'
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      resource.document?.filePath && (
                        <a
                          href={resource.document.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" className='mt-2'>
                            Open File
                          </Button>
                        </a>
                      )
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert variant="default">
              <AlertOctagon />
              <AlertTitle>None</AlertTitle>
              <AlertDescription>
                Currently there are no Resources here. Please add new Resources.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Resources
