"use client";

import React, { useState } from 'react';
import { Globe, Calendar, User, CheckCircle, Clock, AlertCircle, XCircle, Search, Boxes, PlusIcon, CircleMinus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ChangeThemeColor from '@/lib/ChangeThemeColor';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Project, ProjectStatus } from '@/types/projectType';

const ProjectCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isDarkMode = useSelector((state:RootState) => state.booleans.isDarkMode);
  const all_projects = useSelector((state:RootState) => state.allProjects)
  const projects = all_projects.items || [];
  const  filteredProjects =  projects.filter(project =>
    project?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project?.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project?.problemStatement?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const user = useSelector((state:RootState) => state.auth.user);

  const getStatusColor = (status:string) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case ProjectStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case ProjectStatus.ON_HOLD:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case ProjectStatus.NOT_STARTED:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case ProjectStatus.CANCELLED:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusIcon = (status:string) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4" />;
      case ProjectStatus.IN_PROGRESS:
        return <Clock className="w-4 h-4" />;
      case ProjectStatus.NOT_STARTED:
        return <CircleMinus className="w-4 h-4" />;
      case ProjectStatus.ON_HOLD:
        return <AlertCircle className="w-4 h-4" />;
      case ProjectStatus.CANCELLED:
        return <XCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };


  const formatDate = (dateString:string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  React.useEffect(() => {
    if(isDarkMode){
      ChangeThemeColor("#171717")
    }
  },[isDarkMode]);

  if(!all_projects.isLoaded){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if(projects.length === 0 && all_projects.isLoaded){
    return (
      <div className="p-6 max-sm:p-4 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <CardHeader>
            <Boxes className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle className="text-2xl mb-2">No Projects Yet</CardTitle>
           
            { user?.access.createProjects ? 
            <CardDescription>
              Get started by creating your first project to track and manage your work.
            </CardDescription>
            :
            <CardDescription>
              You don&apos;t have any projects yet. Please contact your administrator to create a project.
            </CardDescription>  
          }
          </CardHeader>
          { user?.access.createProjects &&
            <CardContent>
            <Link 
              href="/u/new"
              className="inline-flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PlusIcon className="w-4 h-4" />
              Create New Project
            </Link>
          </CardContent>}
        </Card>
      </div>
    );
  }
  return (
    <div className="p-6 max-sm:p-0 min-h-screen ">
      <div className=" max-w-7xl mx-auto">
        <div style={{zIndex:1000}}
         className=' sticky max-sm:p-3  max-sm:py-0 max-sm:bg-primary-foreground top-0 flex flex-col'>
          <div className="mb-0 dark:max-sm:bg-primary-foreground bg-card dark:bg-[#0a0a0a]
          max-md:pt-5 max-sm:px-4 max-sm:pt-4 
          flex  items-center justify-between ">
            <div>
              <h1 className="text-3xl flex items-center gap-2 font-bold mb-2 max-sm:text-xl max-md:mb-0">
                <Boxes/>
                My Projects
              </h1>
              <p className=" text-muted-foreground max-sm:hidden">Manage and track your project progress</p>
            </div>
            {/* <Link href={"/u/new"} className=' h-full w-fit group flex items-center flex-col hover:cursor-pointer
             justify-center rounded-lg p-10 max-sm:p-3 border-dashed border-2'>
                    <PlusCircle className=' group-hover:scale-110 transition-all'/>
                    <p className=' text-xs text-muted-foreground'>Add new Project</p>
            </Link> */}
              <div className=' fixed bg-[#5abdf5] flex items-center justify-center h-13 w-13 bottom-20 max-sm:right-5 right-20 rounded-full p-3'>
                <Tooltip>
                  <TooltipTrigger>
                      <Link href={"/u/new"} >
                        <PlusIcon/>
                      </Link>
                  </TooltipTrigger>
                  <TooltipContent className=' mb-10'>
                    <p className='text-sm'>Add new Project</p>
                  </TooltipContent>
                </Tooltip>
              </div>
          </div>
          <div  
                className=' py-3 dark:max-sm:bg-primary-foreground bg-card dark:bg-[#0a0a0a] '>
              <div className="relative mt-3 max-sm:mt-0 max-sm:mx-4">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 max-sm:pl-8 text-sm border max-sm:py-6 rounded-full
                      focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
              </div>
          </div>
        </div>
        <div className=" grid grid-cols-1 max-sm:mt-3 md:grid-cols-2 max-sm:divide-y lg:grid-cols-3 max-sm:gap-3 gap-6">
          {filteredProjects.map((project:Partial<Project>) => (
            <Link  key={project.id} 
                  href={`/${project.id}/dashboard/`}  
                  className=" h-full flex-1 hover:bg-primary-foreground/20">
              <Card className="hover:shadow-lg relative  h-full
                max-sm:pt-2 !gap-0 transition-shadow max-sm:shadow-none max-sm:border-none
                 max-sm:bg-transparent duration-300 ">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl max-sm:text-[16px] font-semibold mb-1 max-sm:mb-0">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-sm mb-3">
                        {project.problemStatement}
                      </CardDescription>
                    </div>
                    {project.isDraft === 1 && (
                      <div className=" absolute right-3 top-3">
                        <Link 
                        href={`/${project.id}/draft`}
                        className="inline-flex items-center px-3 py-1 text-sm 
                        bg-yellow-100 text-yellow-800 hover:bg-yellow-200 
                        rounded-full font-medium transition-colors">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Draft Project
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs font-medium">
                      <Globe className="w-3 h-3 mr-1" />
                      {project.domain}
                    </Badge>
                    <Badge className={`text-xs font-medium ${getStatusColor(project?.status || ProjectStatus.NOT_STARTED)}`}>
                      {getStatusIcon(project?.status || ProjectStatus.NOT_STARTED)}
                      <span className="ml-1 capitalize">{project?.status || ProjectStatus.NOT_STARTED.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 ">
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{35}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className=" bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${35}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 ">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(project?.createdAt || "")}</span>
                      </div>
                      <div className="flex items-center gap-2 ">
                        <User className="w-4 h-4" />
                        <span>{project.max_team_size} members</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 max-sm:pb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === ProjectStatus.COMPLETED).length}
              </div>
              <div className="text-sm ">Completed Projects</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length}
              </div>
              <div className="text-sm ">In Progress</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold ">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm ">Completed</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {/* {projects.reduce((sum, p) => sum + p.notifications, 0)} */}
              </div>
              <div className="text-sm ">Total Notifications</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectCards;