"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { User, UserStatus } from '@/types/userTypes'
import { format } from 'date-fns'
import axiosInstance from '@/config/AxiosConfig'
import { signOut } from 'next-auth/react'
import { Circle, CircleDot, Clock, EyeOff, MinusCircle, Moon } from 'lucide-react'


interface OrganizationMembersProps {
  organization: { id: string };
}

interface OrgUser extends User {
  roleInOrg: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: string,
  userStatus: UserStatus
}

const OrganizationMembers: React.FC<OrganizationMembersProps> = ({ organization }) => {
    const [users, setUsers] = React.useState<OrgUser[]>([])
    const [loading, setLoading] = React.useState(true);
    const statusIcons = {
        [UserStatus.BUSY]: <CircleDot className="h-4 w-4 text-red-500" />,
        [UserStatus.OFFLINE]: <Circle className="h-4 w-4 text-gray-500" />,
        [UserStatus.AVAILABLE]: <Circle className="h-4 w-4 text-green-500" />,
        [UserStatus.DONOT_DISTURB]: <MinusCircle className="h-4 w-4 text-red-500" />,
        [UserStatus.BRB]: <Clock className="h-4 w-4 text-yellow-500" />,
        [UserStatus.APPEAR_AWAY]: <Moon className="h-4 w-4 text-orange-500" />,
        [UserStatus.APPEAR_OFFLINE]: <EyeOff className="h-4 w-4 text-gray-500" />,
    }
    React.useEffect(() => {
        const fetchOrgUsers = async () => {
            if (!organization?.id) return;
        setLoading(true)
            axiosInstance.get(`/api/get/org/users?orgId=${organization.id}`)
            .then((usersResponse) => {
                const usersData = usersResponse.data
                setUsers(usersData)
            })
            .catch((error)=>{
                if(error.response?.status === 404) {
                    setUsers([])
                    console.error("No users found for this organization:", error.response.data.action)
                    if(error.response.data.action === "LOGOUT") {
                    signOut({
                    callbackUrl: "/login",
                    redirect: true
                    });
                    }
                }
                else {
                    console.error("Error fetching organization users:", error)
                }
            })
            .finally(()=>{
                setLoading(false)
            })
        }
        fetchOrgUsers()
    }, [organization?.id])

    if (loading) {
        return (
          <div className="container mx-auto py-8 animate-pulse">
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded-lg"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        )
    }
    if(users.length === 0) {
    return (
      <Card className='max-sm:border-none max-sm:shadow-none'>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>
            No members found in this organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No members available</p>
        </CardContent>
      </Card>
    )
    }
  return (
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
                  {user.joinedAt ? format(new Date(user.joinedAt), 'MMM d, yyyy') : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={"outline"} className=' flex gap-2 capitalize'>
                    {statusIcons[user.userStatus] || <Circle className="h-4 w-4 text-gray-500" />}
                    {user.userStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default OrganizationMembers