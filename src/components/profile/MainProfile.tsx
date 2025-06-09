"use client"
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../ui/card'
import { Button } from '../ui/button'
import { 
  Settings, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Bell,
  Palette,
  Check,
  TriangleAlert
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import ToggleTheme from '../ui/ToggleTheame'
import UserDescription from './widgets/UserDescription'
import { User as UserType } from '@/types/userTypes'
import UserOrganization from './widgets/UserOrganization'
import { Tooltip, TooltipContent } from '../ui/tooltip'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import Logout from '../Auth/Logout'

const MainProfile: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="container max-sm:pb-20 max-md:bg-card max-sm:px-4 mx-auto py-8 space-y-6">
        <UserOrganization organizationId='2' />

      {/* Profile Header */}
      <UserDescription user={auth.user as UserType} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className=' max-sm:shadow-none'>
          <CardHeader className=' max-sm:px-3'>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-sm:px-3">
            <div className=' flex items-center justify-between'>
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className=' max-sm:max-w-[270px] truncate'>{auth.user?.email}</span>
                </div>
                <div className=' w-4 h-4 flex items-center justify-center  '>
                  {auth.user?.isEmailVerified ? 
                  <Tooltip>
                    <TooltipTrigger>
                        <Check size={12} className='  text-green-600'/>
                    </TooltipTrigger>
                    <TooltipContent>
                        Email Verified
                    </TooltipContent>
                  </Tooltip> : 
                    <Tooltip>
                        <TooltipTrigger>
                            <TriangleAlert size={12} className=' text-orange-500'/>
                        </TooltipTrigger>
                        <TooltipContent>
                            Email Not Verified
                        </TooltipContent>
                    </Tooltip>
                  }
                </div>
            </div>
            <div className=' flex items-center justify-between'>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{auth.user?.phoneNumber || 'Not provided'}</span>
                </div>
                <div className=' w-4 h-4 flex items-center justify-center  '>
                  {auth.user?.isPhoneVerified ? 
                  <Tooltip>
                    <TooltipTrigger>
                        <Check size={12} className='  text-green-600'/>
                    </TooltipTrigger>
                    <TooltipContent>
                        Phone Verified
                    </TooltipContent>
                  </Tooltip> : 
                    <Tooltip>
                        <TooltipTrigger>
                            <TriangleAlert size={12} className=' text-orange-500'/>
                        </TooltipTrigger>
                        <TooltipContent>
                            Phone Not Verified
                        </TooltipContent>
                    </Tooltip>
                  }
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className='max-sm:shadow-none'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="appearance">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Appearance
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                      <ToggleTheme controls={true}/>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="notifications">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch id="email-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch id="push-notifications" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <Button variant="outline" disabled className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" disabled className="w-full">
                    Two-Factor Authentication
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
        <Logout />
    </div>
  )
}

export default MainProfile