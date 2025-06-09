"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Invitation, InvitationAction, OrganizationUserRole } from '@/types/invitationType'
import { useParams } from 'next/navigation'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Loader2, Mail, Plus, RefreshCw, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Organization } from '@/types/organizationType'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import axios from 'axios'

const inviteFormSchema = z.object({
  toEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.nativeEnum(OrganizationUserRole),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

const InviteManager = () => {
  const { ord_id } = useParams()
  const [invitations, setInvitations] = React.useState<Invitation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isInviting, setIsInviting] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [org,setOrg] = React.useState<Organization | null>(null);
  const auth = useSelector((state: RootState) => state.auth)

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      toEmail: "",
      role: OrganizationUserRole.MEMBER,
      subject: "Invitation to join organization",
      message: "I'd like to invite you to join our organization on Protrack.",
    },
  })

  const fetchOrganization = async () => {
    try {
      const response = await fetch(`/api/get/org?slug=${ord_id}`)
      if (!response.ok) throw new Error('Failed to fetch organization')
      const data = await response.json()
      setOrg(data)
    } catch (error) {
      console.error('Error fetching organization:', error)
      toast.error('Failed to load organization details')
    }
  }
  const fetchInvitations = async (id:string) => {
    try {
      const response = await fetch(`/api/get/org/invitations?orgId=${id}`)
      if (!response.ok) throw new Error('Failed to fetch invitations')
      const data = await response.json()
      setInvitations(data)
    } catch (error) {
      console.error('Error fetching invitations:', error)
      toast.error('Failed to load invitations')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchOrganization();
  }, [ord_id]);
  React.useEffect(() => {
    if(org?.id){
        fetchInvitations(org.id);
    }
  },[org]);

  const onSubmit = async (values: z.infer<typeof inviteFormSchema>) => {
    setIsInviting(true)
    try {
      const response = await fetch('/api/manage/send_invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          org_id: org?.id,
          fromId: auth.user?.id,
          action: InvitationAction.JOIN_ORGANIZATION,
        }),
      })

      if (!response.ok) throw new Error('Failed to send invitation')

      toast.success('Invitation sent successfully')
      setDialogOpen(false)
      form.reset()
      fetchInvitations(org?.id || ""); // Refresh the invitations list
    } catch (error) {
      console.error('Error sending invitation:', error)
      toast.error('Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }

  const handleDeleteInvitation = async (invitationId: string) => {
    axios.delete("/api/manage/revoke_invitation", {
        data: { invitationId }
    })
    .then(() => {
        toast.success("Invitation revoked successfully!")
        setInvitations((prev) => prev.filter(inv => inv.id !== invitationId))
      }
    )
    .catch((error) => {
        console.error("Error revoking invitation:", error)
        toast.error("Failed to revoke invitation. Please try again.")
      }
    )
  }

  const getRoleBadgeVariant = (role: OrganizationUserRole) => {
    switch (role) {
      case OrganizationUserRole.ADMIN: return "default"
      case OrganizationUserRole.MANAGER: return "secondary"
      case OrganizationUserRole.CLIENT: return "outline"
      default: return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Organization Invitations</CardTitle>
            <CardDescription>Manage member invitations for your organization</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={()=>fetchInvitations(org?.id || '')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your organization
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="toEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-8" placeholder="member@example.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(OrganizationUserRole).map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isInviting}>
                        {isInviting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Send Invitation
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Mail className="h-8 w-8 mb-2" />
            <p>No invitations sent yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invited Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.toEmail}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(invitation.role)}>
                      {invitation.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{invitation.subject}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(invitation.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Pending</Badge>
                  </TableCell>
                  <TableCell>
                    <Button onClick={()=>handleDeleteInvitation(invitation.id)} size={"sm"}
                        className=' !px-2 !py-1'
                        variant={"destructive"}>
                            <Trash2/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default InviteManager;