"use client"
import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Archive,
  Reply,
  Forward,
  MoreVertical,
  Trash2,
  Loader2,
  StarIcon,
  ArchiveRestore
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { InvitationStatus, OrganizationUserRole } from '@/types/invitationType'
import { Inbox } from '@/types/inboxType'
import axiosInstance from "@/config/AxiosConfig"
import { Organization } from '@/types/organizationType'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'
import Link from 'next/link'
import { RefreshToken } from '@/lib/RefreshToken'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'

interface Props {
  invitation: Partial<Inbox>;
  handleStarToggle: (id: string) => void;
  handleTrashItem: (id: string) => void; // Optional function to handle trashing
  handleArchiveItem: (id: string) => void; // Function to handle archiving 
  handleItemChange: (id: string, data : {
    status: InvitationStatus;
    seenAt?: string;
  }) => void; // Function to handle item change
}

const InvitationViewer: React.FC<Props> = ({ invitation,handleStarToggle,handleTrashItem,handleArchiveItem,handleItemChange }) => {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(false)
  const invitationData = invitation.invitation;
  const auth = useSelector((state: RootState) => state.auth); 
  const router = useRouter();
  useEffect(() => {
    const fetchOrganization = async () => {
      if (!invitationData?.org_id) return
      
      setLoading(true)
      try {
        const response = await axiosInstance.get(`/api/get/org?orgId=${invitationData.org_id}`)
        setOrganization(response.data)
      } catch (error) {
        console.error('Failed to fetch organization:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrganization()
  }, [invitationData?.org_id])

  const [Status,setStatus] = useState<InvitationStatus>(invitationData?.status || InvitationStatus.PENDING);
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleInvitationAction = async (action:InvitationStatus) => {
    axiosInstance.post('/api/manage/inbox/handle_invitation', {
      fromUserId: invitation.fromUser?.id || "",
      users_email: invitation.invitation?.toEmail || "",
      inboxId: invitation?.id,
      action: invitationData?.action,
      inviteId: invitationData?.id,
      role: invitationData?.role || OrganizationUserRole.MEMBER,
      orgId: invitationData?.org_id,
      projectId: "",
      slug: organization?.slug || "",
      status: action
    }).then(async (response) => {
      console.log('Invitation action response:', response.data);
      handleItemChange(invitation.id || "", {
        status: action,
        seenAt: new Date().toISOString()
      })
      toast.success(`Invitation ${action.toLowerCase()} successfully!`, {
        duration: 3000,
        description: `You have ${action.toLowerCase()} the invitation to join ${organization?.name || 'the organization'}.`
      })
      setStatus(action);
      if(auth.user?.email){
        await RefreshToken(auth.user?.email);
      }
    }).catch((error) => {
      console.error('Error handling invitation action:', error);
      toast.error(`Failed to ${action.toLowerCase()} invitation`, {
        duration: 3000,
        description: error.response?.data?.error || 'An error occurred while processing the invitation.'
      })
    })
  }

  return (
    <div className="h-[calc(100vh - 60px)] relative max-sm:mt-12 max-sm:mb-20 w-full max-w-screen overflow-auto">
      {/* Gmail-style toolbar - Mobile responsive */}
      <div style={{
        zIndex: 2000
      }} className="border-b max-sm:fixed pt-2 max-sm:pt-0 top-0 left-0 right-0 z-10 bg-card">
        <div className="px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button onClick={()=> router.back()} variant="ghost" size="sm" className="p-1 sm:p-2">
              <ArrowLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <Button onClick={()=> handleArchiveItem(invitation.id || "")} variant="ghost" size="sm">
              {
                invitation.isArchived ?
                <ArchiveRestore size={16} className="text-yellow-500" /> :
                <Archive size={16} className="text-muted-foreground" />
              }
            </Button>
            <Button onClick={() => handleTrashItem(invitation.id || "")} variant="ghost" size="sm">
              {
                invitation.isDeleted ? 
                <Trash2 size={16} className="text-red-500" /> : 
                <Trash2 size={16} className="text-muted-foreground" />
              }
            </Button>
            <Tooltip>
              <TooltipTrigger>
                  <Button 
                      variant="ghost" 
                      size="sm"
                onClick={()=>handleStarToggle(invitation.id || "")}
                  >
                      <StarIcon 
                          size={18} 
                          className={`cursor-pointer
                          ${invitation.isStarred ? "text-yellow-400" : "text-muted-foreground"}`}
                          fill={invitation.isStarred ? "currentColor" : "none"}
                      />
                  </Button>
              </TooltipTrigger>
              <TooltipContent className="!text-xs">
                  {invitation.isStarred ? "Unstar" : "Star"}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button disabled variant="ghost" size="sm" className="p-1 sm:p-2">
              <Reply className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Reply</span>
            </Button>
            <Button disabled variant="ghost" size="sm" className="p-1 sm:p-2">
              <Forward className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Forward</span>
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      { loading ? 
        <div className='flex items-center justify-center w-full h-full min-h-[70vh]'>
            <Loader2 className="h-8 w-8 mx-auto my-10 animate-spin text-muted-foreground" />
        </div>
        :
      <div className=" mx-auto overflow-y-auto">
          {/* Gmail-style email header - Mobile responsive */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b">
            <div className="flex items-start gap-3 sm:gap-4">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarImage src={organization?.logo || ''} alt={organization?.name || 'Organization Logo'} />
                <AvatarFallback className="font-medium text-xs sm:text-sm">
                  {organization ? getInitials(organization.name) : 'ORG'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-start sm:items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-xl capitalize font-normal leading-tight">
                      {invitationData?.subject || 'Organization Invitation'}
                    </h1>
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Invitation
                    </Badge>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {invitationData?.createdAt && format(new Date(invitationData.createdAt), window.innerWidth < 640 ? 'MMM d, yyyy' : 'MMM d, yyyy, h:mm a')}
                  </span>
                </div>
                <div className="flex flex-wrap flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate max-w-[150px] sm:max-w-none">
                      {loading ? 'Loading...' : organization?.name || 'Organization'}
                    </span>
                    <span className="text-muted-foreground truncate">&lt;{invitation.fromUser?.email}&gt;</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">to</span>
                    <span className="font-medium truncate">{invitationData?.toEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email content - Mobile responsive */}
          <div className="px-3 sm:px-6 py-4 sm:py-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Message body */}
              <div className="leading-relaxed">
                <p className="mb-4 text-sm sm:text-base">
                  {invitationData?.message || `You've been invited to join ${organization?.name || 'our organization'}.`}
                </p>
              </div>

              {/* Organization card - Gmail style - Mobile responsive */}
              <div className="rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarFallback className="font-medium text-sm capitalize">
                      {organization ? getInitials(organization.name) : 'ORG'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Link href={"/org/"+organization?.slug} target='_blank' className="font-medium mb-1 text-sm sm:text-base">
                      {loading ? 'Loading organization...' : organization?.name || 'Organization'}
                    </Link>
                    {organization?.description && (
                      <p className="text-xs sm:text-sm mb-2 text-muted-foreground line-clamp-2">{organization.description}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-muted-foreground min-w-[40px]">Role:</span>
                        <span className="font-medium">
                          {invitationData?.role || invitationData?.invitedTo}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-muted-foreground min-w-[100px] sm:min-w-[120px]">Organization ID:</span>
                        <code className="text-xs px-2 py-1 w-fit rounded border truncate bg-muted font-mono break-all">
                          {invitationData?.org_id ? invitationData.org_id.slice(0,8) + "x".repeat(invitationData.org_id.length - 8) : 'N/A'}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons - Mobile responsive */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  className="w-full sm:w-auto px-4 sm:px-6 text-sm"
                  disabled={Status !== InvitationStatus.PENDING}
                  onClick={() => {
                    // Handle accept invitation
                    handleInvitationAction(InvitationStatus.ACCEPTED)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Invitation
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto px-4 sm:px-6 text-sm"
                  disabled={Status !== InvitationStatus.PENDING}
                  onClick={() => {
                    // Handle decline invitation
                    handleInvitationAction(InvitationStatus.DECLINED)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
              
              {/* Status Alert - Mobile responsive */}
              {
                InvitationStatus.PENDING !== Status && 
                <Alert variant={Status === InvitationStatus.ACCEPTED ? 'default' : 'destructive'} className="mt-4">
                    {
                      Status === InvitationStatus.ACCEPTED ? 
                      <CheckCircle className="h-5 w-5 !text-green-500" /> : 
                      <XCircle className="h-5 w-5 !text-red-500" />
                    }
                  <AlertTitle>Invitation action</AlertTitle>
                  <AlertDescription className=' flex flex-wrap'>
                    You have {Status.toLowerCase()} the invitation to join{' '}
                    <span className="font-medium capitalize">{organization?.name || 'the organization'}</span>
                    {Status === InvitationStatus.ACCEPTED && ' You can now access the organization dashboard and resources.'}
                  </AlertDescription>
                </Alert>
              }
              
              {/* Timeline - Mobile responsive */}
              <details className="mt-6">
                <summary className="cursor-pointer text-xs sm:text-sm hover:bg-muted p-2 rounded flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  View Timeline
                </summary>
                <div className="mt-3 pl-2 sm:pl-6 space-y-2 text-xs sm:text-sm">
                  {[
                    { label: 'Invitation Created', date: invitationData?.createdAt },
                    { label: 'Last Updated', date: invitationData?.updatedAt },
                    { label: 'Mapped', date: invitationData?.mappedAt }
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 py-1 border-b border-muted last:border-b-0">
                      <span className="text-muted-foreground font-medium">{item.label}</span>
                      <span className="font-mono text-xs sm:text-sm">
                        {item?.date ? format(new Date(item.date), window.innerWidth < 640 ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy HH:mm') : 'Not available'}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
      </div>}
    </div>
  )
}

export default InvitationViewer