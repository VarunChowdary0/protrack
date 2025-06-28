import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Participant, ParticipantRole } from '@/types/participantType'
import { toast } from 'sonner'
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '@/config/AxiosConfig'
import { updateProject } from '@/redux/reducers/SelectedProject'
import { Input } from '@/components/ui/input'
import { X, Settings, Loader2, Shield } from 'lucide-react'

const defaultColor = "bg-gray-100 text-gray-800 border-gray-300"

const roleColors: Partial<Record<ParticipantRole, string>> = {
  [ParticipantRole.MANAGER]: "bg-purple-50 text-purple-700 border-purple-200",
  [ParticipantRole.PRODUCT_MANAGER]: "bg-blue-50 text-blue-700 border-blue-200",
  [ParticipantRole.LEAD]: "bg-indigo-50 text-indigo-700 border-indigo-200",
  [ParticipantRole.DEVELOPER]: "bg-green-50 text-green-700 border-green-200",
  [ParticipantRole.DESIGNER]: "bg-pink-50 text-pink-700 border-pink-200",
  [ParticipantRole.QA]: "bg-yellow-50 text-yellow-700 border-yellow-200",
  [ParticipantRole.STAKEHOLDER]: "bg-orange-50 text-orange-700 border-orange-200",
  [ParticipantRole.ARCHITECT]: "bg-gray-50 text-gray-700 border-gray-200",
  [ParticipantRole.CUSTOM]: "bg-muted text-muted-foreground border",
}

interface ParticipantWidProps extends Partial<Participant> {
  onParticipantUpdated?: (participant: Participant) => void;
  onParticipantRemoved?: (participantId: string) => void;
  canEdit?: boolean;
  canRemove?: boolean;
}

const ParticipantWid: React.FC<ParticipantWidProps> = ({ 
  onParticipantUpdated,
  onParticipantRemoved,
  canEdit = true,
  canRemove = true,
  ...participant 
}) => {
  const [searchRole, setSearchRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const project = useSelector((state: RootState) => state.selectedProject.project);
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveParticipant = async (participant: Partial<Participant>) => {
    if (!participant.id) return;

    setIsLoading(true);
    try {
      await axiosInstance.delete('/api/project/manage/participants/delete', {
        params: {
          id: participant.id,
        }
      });
      
      console.log('Participant removed successfully');
      
      toast.success('Participant removed successfully', {
        description: `${participant.user?.firstname} ${participant.user?.lastname} has been removed from the project.`,
      });

      if (project) {
        dispatch(updateProject({
          ...project,
          participants: project.participants?.filter(p => p.id !== participant.id) || []
        }));
      }

      onParticipantRemoved?.(participant.id);
      
    } catch (err:unknown) {
        const error = err as { response?: { data?: { error?: string } }, message?: string };
        toast.error("Failed to Remove Participant", {
          description: error.response?.data?.error || error.message || 'An error occurred while removing the participant',
        })
      } 
          finally {
      setIsLoading(false);
    }
  }

  const handleRoleChange = async (
    participant: Partial<Participant>,
    newRole: ParticipantRole
  ) => {
    if (!participant.id) return;

    setIsRoleLoading(true);
    try {
      const updatedParticipant = {
        ...participant,
        role: newRole,
        isLead: newRole === ParticipantRole.LEAD
      };

      await axiosInstance.post('/api/project/manage/participants/edit', updatedParticipant);
      
      console.log('Participant role updated successfully');
      
      toast.success('Role updated successfully', {
        description: `${participant.user?.firstname}'s role has been changed to ${newRole.replace(/_/g, ' ')}.`,
      });

      // Update Redux store
      if (project) {
        const updatedParticipants = project.participants?.map(p => 
          p.id === participant.id 
            ? { ...p, role: newRole, isLead: newRole === ParticipantRole.LEAD }
            : p
        ) || [];

        dispatch(updateProject({
          ...project,
          participants: updatedParticipants
        }));
      }

      onParticipantUpdated?.(updatedParticipant as Participant);
      
    } catch (err:unknown) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            toast.error("Error Saving Draft", {
              description: error.response?.data?.error || error.message || 'An error occurred',
            })
          } 
         finally {
      setIsRoleLoading(false);
    }
  }

  const handleStatusChange = async (
    participant: Partial<Participant>,
    field: 'isActive' | 'isTeamMember',
    value: boolean
  ) => {
    if (!participant.id) return;

    setIsStatusLoading(true);
    try {
      const updatedParticipant = {
        ...participant,
        [field]: value
      };

      await axiosInstance.post('/api/project/manage/participants/edit', updatedParticipant);
      
      const fieldLabel = field === 'isActive' ? 'status' : 'membership';
      const statusLabel = value ? 'activated' : 'deactivated';
      
      toast.success(`Participant ${fieldLabel} updated`, {
        description: `${participant.user?.firstname} has been ${statusLabel}.`,
      });

      // Update Redux store
      if (project) {
        const updatedParticipants = project.participants?.map(p => 
          p.id === participant.id 
            ? { ...p, [field]: value }
            : p
        ) || [];

        dispatch(updateProject({
          ...project,
          participants: updatedParticipants
        }));
      }

      onParticipantUpdated?.(updatedParticipant as Participant);
      
    }catch (err:unknown) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            toast.error("Error Saving Draft", {
              description: error.response?.data?.error || error.message || 'An error occurred',
            })
          }  finally {
      setIsStatusLoading(false);
    }
  }

  const filteredRoles = Object.values(ParticipantRole).filter(
    (role) =>
      !searchRole || role.toLowerCase().includes(searchRole.toLowerCase())
  );

  // Don't render if participant data is incomplete
  if (!participant.id || !participant.user) {
    return null;
  }

  return (
    <div
      key={participant.id}
      className={`p-4 rounded-lg border hover:bg-secondary/50 transition-all duration-200 ${
        !participant.isActive ? 'opacity-60 bg-muted/20' : ''
      }`}
    >
      <div className="flex items-center max-md:flex-col max-md:w-full max-md:items-start gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={participant.user?.profilePicture} 
                alt={`${participant.user?.firstname} ${participant.user?.lastname}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {participant.user?.firstname?.[0]?.toUpperCase()}
                {participant.user?.lastname?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!participant.isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}
          </div>
          
          <div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm truncate">
                    {participant.user?.firstname} {participant.user?.lastname}
                </p>
                
                {participant.role && (
                    <Badge
                    variant="outline"
                    className={`${roleColors[participant.role] || defaultColor} text-xs`}
                    >
                    {participant.role.replace(/_/g, " ")}
                    </Badge>
                )}
                
                {participant.isLead && (
                    <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Lead
                    </Badge>
                )}
                
                {!participant.isTeamMember && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                    External
                    </Badge>
                )}
                </div>
                
                <p className="text-xs text-muted-foreground truncate">
                {participant.user?.email}
                </p>
            </div>
          </div>
        </div>
        
        <div className="flex max-md:mt-3 max-md:w-full items-center gap-2">
          {canEdit && (
            <div className="flex max-md:flex-1 items-center gap-2">
              <Select
            defaultValue={participant.role}
            onValueChange={(value) => handleRoleChange(participant, value as ParticipantRole)}
            disabled={isRoleLoading || isLoading}
              >
            <SelectTrigger className="h-8 max-md:flex-1 w-[180px] relative">
              {isRoleLoading && (
                <Loader2 className="absolute left-2 h-3 w-3 animate-spin" />
              )}
              <SelectValue placeholder="Select role" className={isRoleLoading ? 'ml-5' : ''} />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  className="mb-2 h-8"
                  placeholder="Search roles..."
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                />
              </div>
              {filteredRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.replace(/_/g, " ")
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
              </Select>

              <Popover open={showSettings} onOpenChange={setShowSettings}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground"
                disabled={isLoading}
              >
                {isStatusLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Participant Settings</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Active Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Active participants can access the project
                  </p>
                </div>
                <Switch
                  checked={participant.isActive || false}
                  onCheckedChange={(checked) => 
                    handleStatusChange(participant, 'isActive', checked)
                  }
                  disabled={isStatusLoading}
                />
                  </div>
                  
                  <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Team Member</Label>
                  <p className="text-xs text-muted-foreground">
                    Internal team member vs external stakeholder
                  </p>
                </div>
                <Switch
                  checked={participant.isTeamMember || false}
                  onCheckedChange={(checked) => 
                    handleStatusChange(participant, 'isTeamMember', checked)
                  }
                  disabled={isStatusLoading}
                />
                  </div>
                </div>
              </div>
            </PopoverContent>
              </Popover>
            </div>
          )}
          
          {canRemove && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Participant</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {participant.user?.firstname} {participant.user?.lastname} from this project? 
                This action cannot be undone and they will lose access to the project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleRemoveParticipant(participant)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  )
}

export default ParticipantWid   