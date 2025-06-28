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
import { Invitation, InvitationAction, InvitationStatus } from '@/types/invitationType'
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
import { CheckCheck, Clock, Loader2, LucideCrown, Mail, Plus, RefreshCw, Search, Trash2, UserPlus, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import axiosInstance from '@/config/AxiosConfig'
import { Tooltip,TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useParams } from 'next/navigation'
import { ParticipantRole } from '@/types/participantType'

const inviteFormSchema = z.object({
  toEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.nativeEnum(ParticipantRole),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

const InviteToProject:React.FC = () => {
    const {project_id} = useParams();
  const [invitations, setInvitations] = React.useState<Invitation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isInviting, setIsInviting] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const auth = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = React.useState("");

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      toEmail: "",
      role: ParticipantRole.DEVELOPER,
      subject: "Invitation to contribute",
      message: "I'd like to invite you to join our project on Protrack as a contributor.",
    },
  })


  const fetchInvitations = async (id:string) => {
    console.log("Fetching invitations for org:", id)
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/api/project/get-invitations`, {
        params: { projectId: id }
      });
      setInvitations(response.data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchInvitations(project_id?.toString() ?? "");
  },[project_id]);


  const onSubmit = async (values: z.infer<typeof inviteFormSchema>) => {
    setIsInviting(true)
    axiosInstance.post('/api/manage/send_invitation', {
        ...values,
        fromId: auth.user?.id,
        projectId: project_id,
        role: values.role,
        org_id: auth.user?.organizationId,
        action: InvitationAction.EXTERNAL_PROJECT_INVITATION,
      })
      .then((res)=>{
        console.log(res.data.message);
        toast.success('Invitation sent successfully',
          {
            description: res.data.message || "Invitation sent successfully",
          }
        )
      })
      .catch((error) => {
        console.error('Error sending invitation:', error);
        toast.error('Failed to send invitation', {
          description: error.response?.data?.error || "An error occurred while sending the invitation",
        });
      })
    .finally(() => {
      setIsInviting(false);
      setDialogOpen(false);
      form.reset();
      fetchInvitations(Array.isArray(project_id) ? project_id[0] : project_id?.toString() ?? "");
    });
  }

  const handleDeleteInvitation = async (invitationId: string) => {
    axiosInstance.delete("/api/manage/revoke_invitation", {
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


  const filteredInvitations = invitations.filter((invitation) =>
    invitation.toEmail.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Card className=' pt-0'>
      <CardHeader className=' sticky rounded-t-2xl top-0 pt-5 pb-2 bg-white dark:bg-[#171717] z-40'>
        <div className="flex items-center justify-between">
          <div className=' w-full flex items-center justify-between'>
            <div>
              <CardTitle className="text-xl"> Invitations</CardTitle>
              <CardDescription>Manage Contributor invitations for the project</CardDescription>
            </div>
            <div className="flex max-sm:flex-col-reverse items-end justify-end gap-2">
              {
                isLoading ?
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                  :
                <Button variant="outline" size="icon" className=' max-sm:!p-1' onClick={()=>fetchInvitations(Array.isArray(project_id) ? project_id[0] : project_id?.toString() ?? '')}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              }
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className=' max-sm:!py-0 max-sm:scale-75 max-sm:translate-x-5 max-sm:text-xs'>
                    <UserPlus className="h-4 w-4 mr-2 max-sm:mr-0" />
                    Invite
                    <span className=' max-sm:hidden'>
                        Contributor
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className=' flex items-center gap-2'>
                      {
                      auth.user?.access.createOrganizationUsers 
                        ? <UserPlus/>
                        :<LucideCrown/>
                    }
                      Invite New Contributor</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join the organization
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
                                  {Object.values(ParticipantRole)
                                  .filter(role=> role !== ParticipantRole.CREATOR
                                  ).map((role) => (
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

          </div>
          <div className=' relative'>
            <Search className=' absolute top-1.5 left-2 text-muted-foreground'/>
            <Input
              placeholder="Search invitations..."
              className="max-w-sm pl-10"
              onChange={(e) => {  
                setSearchTerm(e.target.value);
              }
              }
            />
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
          <Table className=' mybar '>
            <TableHeader>
              <TableRow>
                <TableHead>Invited Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvitations.map((invitation) => (
                <TableRow className={` ${invitation.status === InvitationStatus.ACCEPTED ? " " : 
                  invitation.status === InvitationStatus.DECLINED ? " bg-[#4e000010] hover:bg-[#4e000020]" : ""
                }`} key={invitation.id}>
                  <TableCell>{invitation.toEmail}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {invitation.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{invitation.subject}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(invitation.createdAt), 'MMM d, yyyy, h:mm a')}
                  </TableCell>
                  <TableCell className=' max-w-[80px]'>
                    {
                      invitation.mappedAt ?
                      <div className=' w-full  pl-[20%]'>
                        <Tooltip>
                            <TooltipTrigger>
                            {invitation.status === InvitationStatus.ACCEPTED ? (
                              <CheckCheck className="h-4 w-4 mr-1 text-blue-500" />
                            ) : invitation.status === InvitationStatus.DECLINED ? (
                              <XIcon className="h-4 w-4 mr-1 text-red-500" />
                            ) : (
                              <CheckCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                            )}
                            </TooltipTrigger>
                          <TooltipContent>
                            Sent to inbox
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      :
                       <div className=' w-full  pl-[20%]'>
                        <Tooltip>
                          <TooltipTrigger>
                            <Clock className="h-4 w-4 mr-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Waiting for user Registation
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    }
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

export default InviteToProject;