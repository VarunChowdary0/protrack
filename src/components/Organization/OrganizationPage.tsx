"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Building2, CalendarDays, Loader2Icon, Users2 } from 'lucide-react'
import { Organization } from '@/types/organizationType'
import { format } from 'date-fns'
import axiosInstance from '@/config/AxiosConfig'
import OrganizationMembers from './widgets/OrganizationMembers'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import InviteOrganizaionUsers from './widgets/InviteOrganizationUsers'
import NotFound from '../NotFound'
import { UserRole } from '@/types/userTypes'
import SignOutWrapper from '@/lib/SignOutWrapper'


const OrganizationPage = () => {
  const { ord_id } = useParams()
  const [organization, setOrganization] = React.useState<Organization | null>(null)
  const [loading, setLoading] = React.useState(true);
  const auth = useSelector((state:RootState)=> state.auth);

    React.useEffect(() => {
      const fetchOrgData = async () => {
        axiosInstance.get(`/api/get/org?slug=${ord_id}`)
        .then((orgResponse) => {
        const orgData = orgResponse.data
        setOrganization(orgData)
        })
        .catch((error)=>{
          if(error.response?.status === 404) {
          console.error("No organization:", error.response.data.action)
          if(error.response.data.action === "LOGOUT") {
            SignOutWrapper({
            callbackUrl: "/login",
            redirect: true
            });
          }
          }
          else {
          console.error("Error fetching organization:", error)
          }
        })
        .finally(()=>{
        setLoading(false)
        })
      }

      if (ord_id) {
        fetchOrgData()
      }
    }, [ord_id])

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin"/>
      </div>
    )
  }

  if (!organization) {
    return (
      <NotFound />
      // <div className="container mx-auto py-8">
      //   <Card>
      //     <CardContent className="flex flex-col items-center justify-center h-32">
      //       <p className="text-muted-foreground">Organization not found</p>
      //     </CardContent>
      //   </Card>
      // </div>
    )
  }

  return (
    <div className="container mx-auto max-md:bg-card min-h-screen py-8 space-y-6">
      {/* Organization Overview */}
      <Card className=' max-sm:border-none max-sm:shadow-none'>
        <CardHeader className="flex flex-row max-sm:border-none max-sm:shadow-none items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={organization.logo} />
            <AvatarFallback className="bg-primary">
              <Building2 className="h-10 w-10 text-primary-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl max-sm:text-lg capitalize font-bold">{organization.name}</CardTitle>
            <CardDescription className="mt-2 text-base">
              {organization.description}
            </CardDescription>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users2 className="h-4 w-4" />
                {organization.membersCount} members
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Created {organization.createdAt !== "null" ?
                 format(new Date(organization.createdAt), 'MMM d, yyyy')
                    :
                    "NA"
                }
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      {
        auth.user?.access?.accessOrganizationUsers &&
        (
          auth.user.role === UserRole.ADMIN 
          // able to access the same org 
          || auth.user.organizationId === organization.id
        ) &&
        <OrganizationMembers organization={organization}/>
      }
      {/* Invite Manager */}
      {
        (auth.user?.access.createOrganizationUsers ||
          auth.user?.access.createOrganizationManagers) && (
            auth.user.role === UserRole.ADMIN 
            // able to access the same org 
            || auth.user.organizationId === organization.id
          ) &&
          <InviteOrganizaionUsers orgId={organization.id}/>
      } 
    </div>
  )
}

export default OrganizationPage