"use client";

import React, { useState } from 'react';
import { Bell, Globe, Calendar, User, CheckCircle, Clock, AlertCircle, XCircle, Search, Boxes } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ChangeThemeColor from '@/lib/ChangeThemeColor';
import { Input } from './ui/input';

const ProjectCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isDarkMode = useSelector((state:RootState) => state.booleans.isDarkMode);
  const [projects] = useState([
    {
      id: 1,
      name: "E-commerce Platform",
      domain: "Retail & Commerce",
      status: "active",
      notifications: 3,
      description: "Modern e-commerce solution with payment integration",
      createdAt: "2024-01-15",
      team: 8,
      progress: 75
    },
    {
      id: 2,
      name: "Healthcare Dashboard",
      domain: "Healthcare",
      status: "in-progress",
      notifications: 1,
      description: "Patient management system with analytics",
      createdAt: "2024-02-10",
      team: 5,
      progress: 45
    },
    {
      id: 3,
      name: "Financial Analytics",
      domain: "Finance",
      status: "completed",
      notifications: 0,
      description: "Real-time financial data visualization platform",
      createdAt: "2023-11-20",
      team: 12,
      progress: 100
    },
    {
      id: 4,
      name: "Learning Management",
      domain: "Education",
      status: "on-hold",
      notifications: 2,
      description: "Online learning platform with course management",
      createdAt: "2024-03-05",
      team: 6,
      progress: 30
    },
    {
      id: 5,
      name: "Social Media App",
      domain: "Social Media",
      status: "in-progress",
      notifications: 5,
      description: "Next-gen social platform with AI features",
      createdAt: "2024-01-30",
      team: 15,
      progress: 60
    },
    {
      id: 6,
      name: "IoT Monitoring",
      domain: "Technology",
      status: "active",
      notifications: 1,
      description: "Smart device monitoring and control system",
      createdAt: "2024-02-25",
      team: 4,
      progress: 85
    }
  ]);

  const  filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status:string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusIcon = (status:string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'on-hold':
        return <AlertCircle className="w-4 h-4" />;
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

  return (
    <div className="p-6 max-sm:p-0 min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div style={{zIndex:1000}}
         className=' sticky max-sm:p-3  max-sm:py-0 max-sm:bg-primary-foreground top-0 flex flex-col'>
          <div className="mb-0 bg-card dark:bg-[#0a0a0a] max-md:pt-5  max-sm:bg-primary-foreground max-sm:px-4 max-sm:pt-4 ">
            <h1 className="text-3xl flex items-center gap-2 font-bold mb-2 max-sm:text-xl max-md:mb-0">
              <Boxes/>
              My Projects
            </h1>
            <p className=" text-muted-foreground max-sm:hidden">Manage and track your project progress</p>
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
        <div className="grid grid-cols-1 max-sm:mt-3 md:grid-cols-2 max-sm:divide-y lg:grid-cols-3 max-sm:gap-3 gap-6">
          {filteredProjects.map((project) => (
            <Link  key={project.id} 
                  href={`/${project.id}/dashboard/`}  
                  className=" h-full flex-1 hover:bg-primary-foreground/20">
              <Card className="hover:shadow-lg  h-full
                max-sm:pt-2 !gap-0 transition-shadow max-sm:shadow-none max-sm:border-none
                 max-sm:bg-transparent duration-300 ">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl max-sm:text-[16px] font-semibold mb-1 max-sm:mb-0">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-sm mb-3">
                        {project.description}
                      </CardDescription>
                    </div>
                    {project.notifications > 0 && (
                      <div className="relative">
                        <Bell className="w-5 h-5 " />
                        <span className="absolute -top-2 -right-2 border bg-[#49b5e8] opacity-90 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {project.notifications}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs font-medium">
                      <Globe className="w-3 h-3 mr-1" />
                      {project.domain}
                    </Badge>
                    <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 ">
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className=" bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 ">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 ">
                        <User className="w-4 h-4" />
                        <span>{project.team} members</span>
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
                {projects.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm ">Active Projects</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.status === 'in-progress').length}
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
                {projects.reduce((sum, p) => sum + p.notifications, 0)}
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