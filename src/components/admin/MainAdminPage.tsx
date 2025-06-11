"use client"
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Building2, 
  Settings, 
  BarChart3,
  FileSpreadsheet,
  Network,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { UserRole } from '@/types/userTypes'


interface AdminOption {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  access: boolean
  requiredPermissions: string[]
}

const AdminOptionCard: React.FC<AdminOption> = ({ 
  title, 
  description, 
  icon, 
  href, 
  access,
  requiredPermissions
}) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Link href={access ? href : '#'} className={!access ? 'cursor-not-allowed' : ''}>
            <Card className={`
             max-sm:p-2
              hover:shadow-md transition-all duration-200 
              ${!access ? 'opacity-50 hover:opacity-50' : 'hover:scale-[1.02]'}
              border-2 ${!access ? 'border-muted' : 'border-transparent hover:border-primary'}
            `}>
              <CardHeader className=' max-sm:px-3'>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${access ? 'bg-primary/10' : 'bg-muted'}`}>
                    {icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg  max-sm:text-md">{title}</CardTitle>
                    <CardDescription className=' max-sm:text-xs'>{description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </TooltipTrigger>
      {!access && (
        <TooltipContent className="max-w-[200px]">
          <p>Requires permissions:</p>
          <ul className="list-disc list-inside text-xs mt-1">
            {requiredPermissions.map(permission => (
              <li key={permission}>{permission}</li>
            ))}
          </ul>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
)

const MainAdminPage = () => {

  const auth = useSelector((state: RootState) => state.auth)
  const adminOptions: AdminOption[] = [
    {
      title: "Organization Management",
      description: "Manage organizations and their settings",
      icon: <Building2 className="h-5 w-5 text-blue-500" />,
      href: "/admin/organizations",
      access: Boolean(auth.user?.access?.manageOrganization && auth.user?.access?.accessOrganization),
      requiredPermissions: ["Manage Organization", "Access Organization"]
    },
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <Users className="h-5 w-5 text-green-500" />,
      href: "/admin/users",
      access: Boolean(auth.user?.access?.createOrganizationUsers && auth.user?.access?.accessOrganizationUsers),
      requiredPermissions: ["Create Organization Users", "Access Organization Users"]
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: <Settings className="h-5 w-5 text-gray-500" />,
      href: "/admin/settings",
      access: Boolean(auth.user?.access?.userRole === UserRole.ADMIN),
      requiredPermissions: ["Manage Organization"]
    },
    {
      title: "Analytics",
      description: "View system analytics and reports",
      icon: <BarChart3 className="h-5 w-5 text-indigo-500" />,
      href: "/admin/analytics",
      access: Boolean(auth.user?.access?.userRole === UserRole.ADMIN),
      requiredPermissions: ["Access Organization", "Access Projects"]
    },
    {
      title: "Activity Logs",
      description: "View system and user activity logs",
      icon: <FileSpreadsheet className="h-5 w-5 text-red-500" />,
      href: "/admin/logs",
      access: Boolean(auth.user?.access?.userRole === UserRole.ADMIN),
      requiredPermissions: ["Access Activities", "Manage Activities"]
    },
    {
      title: "Network & Integration",
      description: "Configure system integrations",
      icon: <Network className="h-5 w-5 text-cyan-500" />,
      href: "/admin/integrations",
      access: Boolean(auth.user?.access?.userRole === UserRole.ADMIN),
      requiredPermissions: ["Manage Organization"]
    }
  ]

//   if(auth.)
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 max-sm:text-xl">Admin Dashboard</h1>
        <p className="text-muted-foreground max-sm:text-xs">
          Manage your organization&apos;s settings and configurations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminOptions.map((option, index) => (
          <AdminOptionCard
            key={index}
            {...option}
          />
        ))}
      </div>
    </div>
  )
}

export default MainAdminPage