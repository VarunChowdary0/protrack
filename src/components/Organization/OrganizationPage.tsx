"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Building2, CalendarDays, Users2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Organization } from '@/types/organizationType'
import { User } from '@/types/userTypes'
import { format } from 'date-fns'
import axios from 'axios'
import InviteManager from './widgets/InviteManager'

interface OrgUser extends User {
  roleInOrg: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: string
}

const OrganizationPage = () => {
  const { ord_id } = useParams()
  const [organization, setOrganization] = React.useState<Organization | null>(null)
  const [users, setUsers] = React.useState<OrgUser[]>([])
  const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchOrgData = async () => {
            try {
                const orgResponse = await axios.get(`/api/get/org?slug=${ord_id}`)
                const orgData = orgResponse.data
                setOrganization(orgData)
                const usersResponse = await axios.get(`/api/get/org/users?orgId=${orgData.id}`)
                const usersData = usersResponse.data
                setUsers(usersData)
            } catch (error) {
                console.error('Error fetching organization data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (ord_id) {
            fetchOrgData()
        }
    }, [ord_id])

  if (loading) {
    return (
      <div className="container mx-auto py-8 animate-pulse">
        <div className="space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-32">
            <p className="text-muted-foreground">Organization not found</p>
          </CardContent>
        </Card>
      </div>
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
            <CardTitle className="text-2xl font-bold">{organization.name}</CardTitle>
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

      {/* Members List */}
      <Card className='max-sm:border-none max-sm:shadow-none'>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>
            List of all members and their roles in the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback>
                        {user.firstname[0]}{user.lastname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.firstname} {user.lastname}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      user.roleInOrg === 'OWNER' ? 'default' :
                      user.roleInOrg === 'ADMIN' ? 'secondary' : 'outline'
                    }>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    { user.joinedAt ? format(new Date(user.joinedAt), 'MMM d, yyyy') : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <InviteManager/>
    </div>
  )
}

export default OrganizationPage