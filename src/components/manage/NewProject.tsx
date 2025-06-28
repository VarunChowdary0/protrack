  "use client"

  import React, { useState, useEffect } from 'react'
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
  import { Label } from '@/components/ui/label'
  import { Input } from '@/components/ui/input'
  import { FolderOpen, Calendar, MapPin, Users as UsersIcon, ExternalLink, GitBranch, Users, PlusCircle, Info, CheckCircle, Circle, ArrowRight, ArrowLeft, Save, HelpCircle } from 'lucide-react'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  import { Textarea } from '@/components/ui/textarea'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { Progress } from '@/components/ui/progress'
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
  import TipSection from './TipSection'
  import { toast } from 'sonner'
  import axiosInstance from '@/config/AxiosConfig'
  import { useSelector } from 'react-redux'
  import { RootState } from '@/redux/store'
  import { Visibility } from '@/types/projectType'
  import { redirect, useParams, useRouter } from 'next/navigation'
import NotFound from '../NotFound'


  interface ProjectFormData {
    name: string
    domain: string
    code: string
    problemStatement: string
    maxTeamSize: string
    siteLink: string
    repositoryLink: string
    visibility: Visibility
    deadline: string
    durationInDays: string
    techStack: string
    location: string
    search?: string
  }

  interface ProjectStep {
    id: number
    title: string
    description: string
    requiredFields: Array<keyof ProjectFormData>
  }

  const projectSteps: ProjectStep[] = [
    {
      id: 1,
      title: 'Project Details',
      description: 'Enter the basic details of your project',
      requiredFields: ['name', 'domain', 'code', 'problemStatement']
    },
    {
      id: 2,
      title: 'Project Configuration',
      description: 'Configure project settings and requirements',
      requiredFields: ['maxTeamSize', 'visibility', 'deadline', 'durationInDays']
    }
  ]

  const NewProject = () => {
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentStep, setCurrentStep] = useState(1)
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
    const [formData, setFormData] = useState<ProjectFormData>({
      name: '',
      domain: '',
      code: '',
      problemStatement: '',
      maxTeamSize: '',
      siteLink: '',
      repositoryLink: '',
      visibility: Visibility.PRIVATE,
      deadline: '',
      durationInDays: '',
      techStack: '',
      location: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    console.log(error)
    const [draftSaved, setDraftSaved] = useState(true)
    const {project_id} = useParams();
    const draftId = project_id;
    const proj = useSelector((state:RootState)=> state.selectedProject);


    const validateStep = (step: number) => {
      const currentStepFields = projectSteps[step - 1].requiredFields
      return currentStepFields.every(field => {
        const value = formData[field]
        if (Array.isArray(value)) {
          return value.length > 0
        }
        return typeof value === 'string' && value.trim() !== ''
      })
    }

    const saveDraft = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.put(
          "/api/project/add/draft",
          {
            id: draftId,
            ...formData,
            stepCompleted: currentStep,
            isDraft: 1,
          },    
        );
          console.log(response.data)
          const data = response.data.project;
          setFormData({
            name: data.name || '',
            domain: data.domain || '',
            code: data.code || '',
            problemStatement: data.problemStatement || '',
            maxTeamSize: data.max_team_size?.toString() || '',
            siteLink: data.site_link || '',
            repositoryLink: data.repositoryLink || '',
            visibility: data.visibility || Visibility.PRIVATE,
            deadline: data.deadline || '',
            durationInDays: data.durationInDays?.toString() || '',
            techStack: data.techStack || '',
            location: data.location || '',
          });
          setDraftSaved(true);
        // setDraftId(response.data.id);
        if(!project_id) {
          router.replace("/"+response.data.id+"/draft")
        }
      } catch (err:unknown) {
        const error = err as { response?: { data?: { error?: string } }, message?: string };
        toast.error("Error Saving Draft", {
          description: error.response?.data?.error || error.message || 'An error occurred',
        })
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      const fetchDraft = () => {
        const draft = proj.project;
        console.log(draft, draft?.domain);
        const payload = {
          name: draft?.name || '',
          domain: draft?.domain ? draft.domain.toString() :"", // Fixed: Check if domain exists before converting
          code: draft?.code || '',
          problemStatement: draft?.problemStatement || '',
          maxTeamSize: draft?.max_team_size?.toString() || '',
          siteLink: draft?.site_link || '',
          repositoryLink: draft?.repositoryLink || '',
          visibility: draft?.visibility || Visibility.PRIVATE,
          deadline: draft?.deadline || '',
          durationInDays: draft?.durationInDays?.toString() || '',
          techStack: draft?.techStack || '',
          location: draft?.location || '',
        }
        console.log(draft?.isDraft)
        if(draft?.isDraft === 0) {
          setIsSubmitted(true);
        }
        console.log(payload)
        setFormData(payload);
        setDraftSaved(true);
      }
      
      // Also check if proj.project exists to avoid errors
      if(project_id && proj.project){
        fetchDraft();
      }
    }, [proj])

    useEffect(() => {
      const debouncedSave = setTimeout(() => {
        if (!draftSaved && formData.name) {
          saveDraft()
        }
      }, 2000)

      return () => clearTimeout(debouncedSave)
    }, [formData, draftSaved])

    const handleInputChange = (field: keyof ProjectFormData, value: string | string[] ) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
      setDraftSaved(false)
    }

    // Check if current step is valid
    const isStepValid = (stepId:number) => {
      const step = projectSteps.find(s => s.id === stepId)
      if (!step) return false
      
      return step.requiredFields.every(field => {
        const value = formData[field]
        return Array.isArray(value) ? value.length > 0 : value && value.trim() !== ''
      })
    }

    // Auto-save draft when step is completed
    const autoSaveDraft = async () => {
      setIsLoading(true)
      try {
        // Simulate API call to save draft
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Here you would make the actual API call
        console.log('Saving draft:', { ...formData, status: 'draft', completedSteps: Array.from(completedSteps) })
        
        setDraftSaved(true)
        setTimeout(() => setDraftSaved(false), 3000)
      } catch (error) {
        console.error('Error saving draft:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Effect to check step completion and save draft
    useEffect(() => {
      if (isStepValid(currentStep) && !completedSteps.has(currentStep)) {
        setCompletedSteps(prev => new Set([...prev, currentStep]))
        autoSaveDraft()
      }
    }, [formData, currentStep])

    const handleNextStep = () => {
      if (currentStep < projectSteps.length && isStepValid(currentStep)) {
        setCurrentStep(currentStep + 1)
      }
    }

    const handlePrevStep = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
      }
    }

    const getProgressPercentage = () => {
      return (completedSteps.size / projectSteps.length) * 100
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateStep(currentStep)) {
        setError("Please fill in all required fields");
        toast.error("Validation Error", {
          description: "Please complete all required fields before submitting.",
        });
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const res = await axiosInstance.put(
          "/api/project/add/draft",
          {
            id: draftId,
            ...formData,
            stepCompleted: currentStep,
            isDraft: 0,
          },    
        );
        console.log(res.data)

        if(res.data.project.isDraft === 0) {
          setFormData({
            name: '',
            domain: '',
            code: '',
            problemStatement: '',
            maxTeamSize: '',
            siteLink: '',
            repositoryLink: '',
            visibility: Visibility.PRIVATE,
            deadline: '',
            durationInDays: '',
            techStack: '',
            location: '',
          });
          setIsSubmitted(true);
        }
      
        // Delete draft if applicable
        // if (draftId) {
        //   await axiosInstance.delete(`/api/projects/draft/${draftId}`, {
        //     headers: {
        //       Authorization: `USER_ID ${userId}`,
        //     },
        //   });
        // }

        toast.success("Project Created Successfully", {
          description: "Your project has been created successfully.",
        });
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } }, message?: string };
        setError(error.response?.data?.error || error.message || 'An error occurred');
        toast.error("Error Creating Project", {
          description: error.response?.data?.error || error.message || 'An error occurred',
        });
      }
      finally{
        setIsLoading(false);
      }
    };

    if(!auth.user?.access?.createProjects) {
      return <NotFound/>
    }

    if(isSubmitted) {
      return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-card'>
          <Card className='p-8 max-w-md w-full'>
            <CardHeader className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center'>
            <CheckCircle className='h-6 w-6 text-green-600' />
          </div> 
          <CardTitle className='text-2xl font-bold'>Project Created Successfully!</CardTitle>
          <CardDescription className='text-base'>
            Your project has been created and is ready for collaboration.
          </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
          <Button 
            onClick={() => window.location.href = `/${draftId}/manage-participants`}
            className='w-full'
          >
            <Users className='mr-2 h-4 w-4' />
            Add Participants
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/u '}
            className='w-full'
          >
            View All Projects
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsSubmitted(false);
              // setDraftId(null);
              redirect('/u/new');
            }}
            className='w-full'
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            Create Another Project
          </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className='min-h-screen bg-card w-full max-sm:mb-10 pt-5 pb-8 px-20 max-md:px-8 max-sm:px-4'>
        {/* Header Section */}
        <div className='mb-10'>
          <div className='flex items-center justify-between gap-4 mb-6'>
            <div className='flex items-center gap-4'>
              <div className='p-2 rounded-lg bg-primary/10'>
                <FolderOpen className='w-8 h-8 max-md:w-7 max-md:h-7 max-sm:w-6 max-sm:h-6 text-primary'/>
              </div>
              {
                project_id ?
                <div>
                  <h1 className='text-4xl max-md:text-3xl max-sm:text-2xl font-bold tracking-tight'>
                    Edit Project
                  </h1>
                  <p className='text-muted-foreground max-sm:text-sm mt-1'>
                    Update your project details and settings as needed.
                  </p>
                </div>
                :
                <div>
                  <h1 className='text-4xl max-md:text-3xl max-sm:text-2xl font-bold tracking-tight'>
                    New Project
                  </h1>
                  <p className='text-muted-foreground max-sm:text-sm mt-1'>
                    Create a new project to start managing your tasks and collaborate with your team.
                  </p>
                </div>
              }
            </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <HelpCircle className="h-5 w-5 text-primary" />
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Info className="h-5 w-5 text-primary" />
                  Quick Tips for 
                  <Badge>
                    Step {currentStep}
                  </Badge>
                </DialogTitle>

                <DialogDescription className="space-y-2 mt-4 ">
                  {currentStep === 1 && (
                    <>
                      <TipSection
                        title="Project Code"
                        content="Use a unique identifier that helps in easy reference. Example: PRJ-2025-001"
                      />
                      <TipSection
                        title="Problem Statement"
                        content="Clearly define the problem your project aims to solve. This helps team members understand the project's goals."
                      />
                      <TipSection
                        title="Project Domain"
                        content="Select the most relevant domain for your project. This helps in categorizing and finding similar projects."
                      />
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <TipSection
                        title="Team Size"
                        content="Consider the project complexity when setting team size. Smaller teams are often more efficient."
                      />
                      <TipSection
                        title="Project Duration"
                        content="Set realistic timelines. Consider buffer time for testing and unexpected challenges."
                      />
                      <TipSection
                        title="Project Visibility"
                        content="Choose visibility carefully. Public projects are visible to everyone, while private projects are only accessible to team members."
                      />
                    </>
                  )}

                  <TipSection
                    title="Auto-Save"
                    content="Your progress is automatically saved as a draft when you complete each change, You can manage your drafts in the 'Drafts' section."
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          </div>

          {/* Progress Section */}
          <div className='bg-muted/30 rounded-lg p-6 mb-6'>
            <div className='flex items-center flex-wrap w-full justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <h2 className='text-lg font-semibold'>Project Creation Progress</h2>
                {draftSaved && (
                  <Badge variant="outline" className='bg-green-50 text-green-700 border-green-200'>
                    <Save className='w-3 h-3 mr-1' />
                    Draft Saved
                  </Badge>
                )}
                {isLoading && (
                  <Badge variant="outline" className='bg-blue-50 text-blue-700 border-blue-200'>
                    <div className='w-3 h-3 mr-1 animate-spin rounded-full border border-blue-600 border-t-transparent' />
                    Saving...
                  </Badge>
                )}
              </div>
              <span className='text-sm text-muted-foreground'>
                {completedSteps.size} of {projectSteps.length} steps completed
              </span>
            </div>
            
            <Progress value={getProgressPercentage()} className='mb-4' />
            
            <div className='flex gap-4 max-sm:gap-2'>
              {projectSteps.map((step, index) => (
                <div key={step.id} className='flex items-center gap-2 '>
                  <div className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    currentStep === step.id 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : completedSteps.has(step.id)
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-muted border-muted-foreground/20'
                  }`}>
                    {completedSteps.has(step.id) ? (
                      <CheckCircle className='w-5 h-5' />
                    ) : (
                      <Circle className='w-5 h-5' />
                    )}
                    <div className=''>
                      <p className='font-medium text-sm'>{step.title}</p>
                      <p className='text-xs max-sm:hidden opacity-80'>{step.description}</p>
                    </div>
                  </div>
                  {index < projectSteps.length - 1 && (
                    <ArrowRight className='w-4 h-4 text-muted-foreground ' />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!(project_id && !proj.isLoaded) ?
        <div className=''>
          {/* Left Column - Form */}
          <div className='lg:col-span-2'>
            <form onSubmit={handleSubmit} className='space-y-8 max-sm:space-y-2'>
              
              {/* Step 1: Project Details */}
              {currentStep === 1 && (
                <Card className='border shadow-sm'>
                  <CardHeader className='pb-6'>
                    <CardTitle className='text-2xl max-md:text-xl font-semibold flex items-center gap-2'>
                      <span className='bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold'>1</span>
                      Project Details
                    </CardTitle>
                    <CardDescription className='text-base'>
                      Fill in the basic information about your project
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className='space-y-6'>
                    {/* Project Name */}
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
                        <Input 
                          id='domain'
                          placeholder='e.g., Web Development, Mobile App' 
                          className='mt-2 h-11 max-sm:text-sm'
                          value={formData.domain}
                          onChange={(e) => handleInputChange('domain', e.target.value)}
                          required
                        />  </div>
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
                  </CardContent>

                  <CardFooter className='pt-6 border-t bg-muted/20'>
                    <div className='flex justify-between w-full'>
                      <div></div>
                      <Button
                        type='button'
                        onClick={handleNextStep}
                        disabled={!isStepValid(1)}
                        className='px-8 py-2.5 h-11 font-medium'
                      >
                        Next Step
                        <ArrowRight className='w-4 h-4 ml-2' />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}

              {/* Step 2: Configuration */}
              {currentStep === 2 && (
                <Card className='border shadow-sm'>
                  <CardHeader className='pb-6'>
                    <CardTitle className='text-2xl max-md:text-xl font-semibold flex items-center gap-2'>
                      <span className='bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold'>2</span>
                      Project Configuration
                    </CardTitle>
                    <CardDescription className='text-base'>
                      Set up project settings and requirements
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className='space-y-6'>
                    {/* Team Size and Location */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <Label htmlFor='teamSize' className='text-sm font-semibold text-foreground flex items-center gap-2'>
                          <UsersIcon className='w-4 h-4' />
                          Max Team Size <span className='text-destructive'>*</span>
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
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor='location' className='text-sm font-semibold text-foreground flex items-center gap-2'>
                          <MapPin className='w-4 h-4' />
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
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <Label htmlFor='siteLink' className='text-sm font-semibold text-foreground flex items-center gap-2'>
                          <ExternalLink className='w-4 h-4' />
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
                          <GitBranch className='w-4 h-4' />
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
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <Label className='text-sm font-semibold text-foreground'>
                          Project Visibility <span className='text-destructive'>*</span>
                        </Label>
                        <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                          <SelectTrigger className='mt-2 h-11 max-sm:text-sm'>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Visibility.PUBLIC}>Public - Anyone can view</SelectItem>
                            <SelectItem value={Visibility.PRIVATE}>Private - Team members only</SelectItem>
                            <SelectItem value={Visibility.RESTRICTED}>Restricted - Managers only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor='deadline' className='text-sm font-semibold text-foreground flex items-center gap-2'>
                          <Calendar className='w-4 h-4' />
                          Deadline <span className='text-destructive'>*</span>
                        </Label>
                        <Input 
                          id='deadline' 
                          type='date' 
                          className='mt-2 h-11 max-sm:text-sm' 
                          value={formData.deadline}
                          onChange={(e) => handleInputChange('deadline', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Duration and Tech Stack */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <Label htmlFor='duration' className='text-sm font-semibold text-foreground'>
                          Duration (Days) <span className='text-destructive'>*</span>
                        </Label>
                        <Input 
                          id='duration' 
                          type='number'
                          placeholder='e.g., 90' 
                          className='mt-2 h-11 max-sm:text-sm' 
                          value={formData.durationInDays}
                          onChange={(e) => handleInputChange('durationInDays', e.target.value)}
                          min="1"
                          required
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
                  </CardContent>

                  <CardFooter className='pt-6 border-t bg-muted/20'>
                    <div className='flex justify-between w-full'>
                      <Button
                        type='button'
                        onClick={handlePrevStep}
                        variant='outline'
                        className='px-8 py-2.5 h-11 font-medium'
                      >
                        <ArrowLeft className='w-4 h-4 mr-2' />
                        Previous
                      </Button>
                      <Button
                        type='submit'
                        disabled={!isStepValid(2) || isLoading}
                        className='px-8 py-2.5 h-11 font-medium'
                      >
                        {isLoading ? (
                          <>
                            <div className='w-4 h-4 mr-2 animate-spin rounded-full border border-white border-t-transparent' />
                            Creating...
                          </>
                        ) : (
                          'Create Project'
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </form>
          </div>
        </div>
        :
        <>
        <div className="flex flex-col gap-4 p-8 px-5"></div>
          <div className="h-16 w-80 mb-10 bg-muted animate-pulse rounded-md" />
          <div className="space-y-4">
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-muted animate-pulse rounded-md" />
              <div className="h-12 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="h-24 bg-muted animate-pulse rounded-md" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-muted animate-pulse rounded-md" />
              <div className="h-12 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        </>

        }

      </div>
    )
  }

  export default NewProject