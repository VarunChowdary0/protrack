"use client";

import React, { useState } from 'react';
import { Bell, Globe, Settings, Eye, Calendar, User, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ProjectCards = () => {
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

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Projects</h1>
          <p className=" text-muted-foreground">Manage and track your project progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300 ">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold mb-1">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-sm mb-3">
                      {project.description}
                    </CardDescription>
                  </div>
                  {project.notifications > 0 && (
                    <div className="relative">
                      <Bell className="w-5 h-5 " />
                      <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
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

              <CardContent className="pt-0">
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

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/${project.id}/dashboard/`}  className="flex-1">
                      <Button variant={'default'} size="sm" >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>  
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
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