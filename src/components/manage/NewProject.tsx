"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FolderCodeIcon, CalendarIcon, MapPinIcon, UsersIcon, ExternalLinkIcon, GitBranchIcon, Users, UserSearch, PlusCircle, Info } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const NewProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    code: '',
    problemStatement: '',
    maxTeamSize: '',
    siteLink: '',
    repositoryLink: '',
    visibility: '',
    deadline: '',
    durationInDays: '',
    techStack: '',
    location: ''
  })

  const handleInputChange = (field:string, value:string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Project Data:', formData)
    // Handle form submission here
  }

  const user = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://example.com/profile.jpg'
  }

  return (
    <div className='min-h-screen bg-card w-full pt-16 pb-8 px-20 max-md:px-8 max-sm:px-4'>
      {/* Header Section */}
      <div className='mb-10'>
        <div className='flex items-center gap-4 mb-3'>
          <div className='p-2 rounded-lg bg-primary/10'>
            <FolderCodeIcon className='w-8 h-8 max-md:w-7 max-md:h-7 max-sm:w-6 max-sm:h-6 text-primary'/>
          </div>
          <div>
            <h1 className='text-4xl max-md:text-3xl max-sm:text-2xl font-bold tracking-tight'>
              New Project
            </h1>
            <p className='text-muted-foreground max-sm:text-sm mt-1'>
              Create a new project to start managing your tasks and collaborate with your team.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 max-md:gap-6'>
        {/* Left Column - Form */}
        <div className='lg:col-span-2'>
          <form onSubmit={handleSubmit} className='space-y-8 max-sm:space-y-2'>
            <Card className='border shadow-sm'>
              <CardHeader className='pb-6'>
                <CardTitle className='text-2xl max-md:text-xl font-semibold'>
                  Project Details
                </CardTitle>
                <CardDescription className='text-base'>
                  Fill in the basic information about your project
                </CardDescription>
              </CardHeader>
              
              <CardContent className='space-y-8 '>
                {/* Project Name Section */}
                <div className='space-y-6 max-sm:space-y-3'>
                  <div>
                    <Label htmlFor='prjName' className='text-sm font-semibold text-foreground'>
                      Project Name <span className='text-destructive'>*</span>
                    </Label>
                    <Input 
                      id='prjName' 
                      placeholder='Enter a descriptive project name' 
                      className='mt-2 h-11 max-sm:text-sm' 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  {/* Domain and Code Row */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <Label className='text-sm font-semibold text-foreground'>
                        Domain <span className='text-destructive'>*</span>
                      </Label>
                      <Select value={formData.domain} onValueChange={(value) => handleInputChange('domain', value)}>
                        <SelectTrigger className='mt-2 h-11 max-sm:text-sm'>
                          <SelectValue placeholder="Select project domain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='web'>Web Development</SelectItem>
                          <SelectItem value='mobile'>Mobile Development</SelectItem>
                          <SelectItem value='data'>Data Science</SelectItem>
                          <SelectItem value='design'>UI/UX Design</SelectItem>
                          <SelectItem value='healthcare'>Healthcare</SelectItem>
                          <SelectItem value='education'>Education</SelectItem>
                          <SelectItem value='fintech'>FinTech</SelectItem>
                          <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor='code' className='text-sm font-semibold text-foreground'>
                        Project Code <span className='text-destructive'>*</span>
                      </Label>
                      <Input 
                        id='code' 
                        placeholder='e.g., PRJ-2025-001' 
                        className='mt-2 h-11 max-sm:text-sm' 
                        value={formData.code}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div>
                    <Label htmlFor='description' className='text-sm font-semibold text-foreground'>
                      Problem Statement <span className='text-destructive'>*</span>
                    </Label>
                    <Textarea 
                      id='description' 
                      placeholder='Clearly describe the problem your project aims to solve and its impact...' 
                      className='mt-2 min-h-[120px] max-sm:text-sm resize-none' 
                      value={formData.problemStatement}
                      onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className='border-t pt-8'>
                  <h3 className='text-lg font-semibold mb-6'>Project Configuration</h3>
                  
                  {/* Team Size and Location */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    <div>
                      <Label htmlFor='teamSize' className='text-sm font-semibold text-foreground flex items-center gap-2'>
                        <UsersIcon className='w-4 h-4' />
                        Max Team Size
                      </Label>
                      <Input 
                        id='teamSize' 
                        type='number'
                        placeholder='e.g., 5' 
                        className='mt-2 h-11 max-sm:text-sm' 
                        value={formData.maxTeamSize}
                        onChange={(e) => handleInputChange('maxTeamSize', e.target.value)}
                        min="1"
                        max="50"
                      />
                    </div>
                    <div>
                      <Label htmlFor='location' className='text-sm font-semibold text-foreground flex items-center gap-2'>
                        <MapPinIcon className='w-4 h-4' />
                        Location
                      </Label>
                      <Input 
                        id='location' 
                        placeholder='e.g., New York, Remote' 
                        className='mt-2 h-11 max-sm:text-sm' 
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Project Links */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    <div>
                      <Label htmlFor='siteLink' className='text-sm font-semibold text-foreground flex items-center gap-2'>
                        <ExternalLinkIcon className='w-4 h-4' />
                        Project Site Link
                      </Label>
                      <Input 
                        id='siteLink' 
                        type='url'
                        placeholder='https://project-demo.com' 
                        className='mt-2 h-11 max-sm:text-sm' 
                        value={formData.siteLink}
                        onChange={(e) => handleInputChange('siteLink', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor='repoLink' className='text-sm font-semibold text-foreground flex items-center gap-2'>
                        <GitBranchIcon className='w-4 h-4' />
                        Repository Link
                      </Label>
                      <Input 
                        id='repoLink' 
                        type='url'
                        placeholder='https://github.com/user/repo' 
                        className='mt-2 h-11 max-sm:text-sm' 
                        value={formData.repositoryLink}
                        onChange={(e) => handleInputChange('repositoryLink', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Visibility and Deadline */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    <div>
                      <Label className='text-sm font-semibold text-foreground'>Project Visibility</Label>
                      <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                        <SelectTrigger className='mt-2 h-11 max-sm:text-sm'>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='public'>Public - Anyone can view</SelectItem>
                          <SelectItem value='private'>Private - Team members only</SelectItem>
                          <SelectItem value='restricted'>Restricted - Managers only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor='deadline' className='text-sm font-semibold text-foreground flex items-center gap-2'>
                        <CalendarIcon className='w-4 h-4' />
                        Deadline
                      </Label>
                      <Input 
                        id='deadline' 
                        type='date' 
                        className='mt-2 h-11 max-sm:text-sm' 
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Duration and Tech Stack */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <Label htmlFor='duration' className='text-sm font-semibold text-foreground'>Duration (Days)</Label>
                      <Input 
                        id='duration' 
                        type='number'
                        placeholder='e.g., 90' 
                        className='mt-2 h-11 max-sm:text-sm' 
                        value={formData.durationInDays}
                        onChange={(e) => handleInputChange('durationInDays', e.target.value)}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor='techStack' className='text-sm font-semibold text-foreground'>Tech Stack</Label>
                      <Input 
                        id='techStack' 
                        placeholder='React, Node.js, MongoDB' 
                        className='mt-2 h-11 max-sm:text-sm' 
                        value={formData.techStack}
                        onChange={(e) => handleInputChange('techStack', e.target.value)}
                      />
                      <p className='text-xs text-muted-foreground mt-2'>Separate technologies with commas</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className='pt-8 border-t bg-muted/20'>
                <div className='flex gap-4 w-full'>
                  <Button
                    type='submit' 
                    className='px-8 py-2.5 h-11 font-medium'
                    size="lg"
                  >
                    Create Project
                  </Button>
                  <Button 
                    type='button' 
                    variant='outline' 
                    className='px-8 py-2.5 h-11 font-medium'
                    size="lg"
                  >
                    Save as Draft
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Right Column - Team Members & Tips */}
        <div className='space-y-6 max-sm:space-y-3 max-sm:mb-10'>
                  {/* Team Members Card */}
          <Card className='border shadow-sm'>
            <CardHeader className='pb-4 max-sm:pb-0'>
              <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                <Users className='w-5 h-5 text-primary' />
                Team Members
              </CardTitle>
              <CardDescription>
                Add team members to collaborate on this project
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 '>
              <div className='relative'>
                <UserSearch size={18} className='absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground'/>
                <Input
                  type='text'
                  placeholder='Search team members...'
                  className='pl-10 h-11 max-sm:text-sm'
                  onChange={(e) => handleInputChange('search', e.target.value)}
                />
              </div>

              <div className='space-y-2 max-h-[45vh] max-sm:min-h-[60vh] overflow-y-auto mybar pr-3'>
                {
                    [1,2,3,4,5,6,7,8,9,10].map((item) => 
                    <div key={item} className='p-4 rounded-lg border hover:bg-secondary/50 transition-all duration-200 cursor-pointer group'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback className='font-medium'>
                            {user.firstname[0]}{user.lastname[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{user.firstname} {user.lastname}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        </div>
                        <PlusCircle className='text-muted-foreground group-hover:text-primary transition-colors' size={18}/>
                    </div>
                    </div>
                    )
                }
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips Card */}
          <Card className='border shadow-sm'>
            <CardHeader className='pb-4 max-sm:pb-0'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                  <Info className='w-5 h-5 text-primary'/>
                  Quick Tips
                </CardTitle>
              </div>
              <CardDescription>
                Helpful information for creating your project
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-5 max-sm:space-y-3'>
              <div className='space-y-2'>
                <h4 className='font-semibold text-sm'>Project Code</h4>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  Use a unique identifier that helps in easy reference. Example: PRJ-2025-001
                </p>
              </div>
              <div className='space-y-2'>
                <h4 className='font-semibold text-sm'>Problem Statement</h4>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  Clearly define the problem your project aims to solve. This helps team members understand the project&apos;s goals.
                </p>
              </div>
              <div className='space-y-2'>
                <h4 className='font-semibold text-sm'>Tech Stack</h4>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  List all major technologies and frameworks that will be used in the project.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default NewProject