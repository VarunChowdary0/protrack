import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/types/userTypes'
import { Loader2, PlusCircle, Check } from 'lucide-react'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axiosInstance from '@/config/AxiosConfig'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { useParams } from 'next/navigation'
import { ParticipantRole } from '@/types/participantType'
import { updateProject } from '@/redux/reducers/SelectedProject'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface OrganizationPeopleProps extends Partial<User> {
  onParticipantAdded?: () => void;
}

const OrganizationPeople: React.FC<OrganizationPeopleProps> = ({ 
  onParticipantAdded, 
  ...user 
}) => {
  const { project_id } = useParams();
  const project = useSelector((state: RootState) => state.selectedProject.project);
  const dispatch = useDispatch<AppDispatch>();
    const [searchRole, setSearchRole] = useState<ParticipantRole | null>(null)

  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<ParticipantRole | ''>('');
  const [isOpen, setIsOpen] = React.useState(false);

  // Check if user is already a participant
  const isAlreadyParticipant = React.useMemo(() => {
    return project?.participants?.some(participant => participant.user?.id === user.id);
  }, [project?.participants, user.id]);

  const handleAddParticipant = async () => {
    if (!selectedRole || !project_id || !user.id) {
      toast.error('Missing required information', {
        description: 'Please select a role and ensure user information is available.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const requestBody = {
        projectId: project_id,
        new_userId: user.id,
        isLead: selectedRole === ParticipantRole.LEAD,
        isTeamMember: true,
        role: selectedRole,
      };

      const response = await axiosInstance.post('/api/project/manage/participants/add', requestBody);
      
      // Success handling
      console.log('Participant added successfully');
      toast.success('Participant added successfully', {
        description: `${user.firstname} ${user.lastname} has been added to the project as ${selectedRole}.`,
      });
      
      // Update Redux store with the new participant
      if (project) {
        const newParticipant = {
          id: response.data?.participant?.id || Date.now().toString(),
          user: user as User,
          role: selectedRole,
          isLead: selectedRole === ParticipantRole.LEAD,
          isTeamMember: true,
          isActive: true,
        };

        dispatch(updateProject({
          ...project,
          participants: [...(project.participants || []), newParticipant]
        }));
      }

      // Reset form and close dialog
      setSelectedRole('');
      setIsOpen(false);
      
      // Call optional callback
      onParticipantAdded?.();
      
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      console.error('Failed to add participant:', error);
      
      // Handle specific error cases
      const errorMessage = error.response?.data?.message || 'There was an error adding the participant. Please try again.';
      
      toast.error('Failed to add participant', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setSelectedRole('');
    }
  };

    const filteredRoles = Object.values(ParticipantRole).filter(
      (role) =>
        !searchRole || role.toLowerCase().includes(searchRole.toLowerCase())
    );

  // Don't render if user data is incomplete
  if (!user.id || !user.firstname || !user.lastname) {
    return null;
  }

  return (
    <div
      key={user.id}
      className="p-3 relative min-w-[280px] rounded-lg border hover:bg-secondary/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profilePicture} alt={`${user.firstname} ${user.lastname}`} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {user?.firstname?.[0]?.toUpperCase()}
            {user?.lastname?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {user?.firstname} {user?.lastname}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        
        <div className="absolute right-3">
          {isAlreadyParticipant ? (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <Check className="h-4 w-4" />
              <span>Added</span>
            </div>
          ) : (
            <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <button 
                  className="p-1 rounded-full hover:bg-secondary transition-colors"
                  aria-label={`Add ${user.firstname} to project`}
                >
                  <PlusCircle className="h-5 w-5 text-primary" />
                </button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    <p className="text-sm text-muted-foreground">Adding participant...</p>
                  </div>
                ) : (
                  <>
                    <DialogHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={user?.profilePicture} alt={`${user.firstname} ${user.lastname}`} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                            {user?.firstname?.[0]?.toUpperCase()}
                            {user?.lastname?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <DialogTitle className="mb-1">{user.firstname} {user.lastname}</DialogTitle>
                          <DialogDescription className="text-sm text-muted-foreground">
                            {user.email}
                            {/* {user.position && <div className="mt-1">{user.position}</div>} */}
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    
                    <div className="flex flex-col gap-4 mt-6">
                        <div>
                            Add {user.firstname} to this project as a participant. Please select a role for them.
                        </div>
                      <div>
                        <label className="text-sm mb-2">Role</label>
                        <Select
                        //   defaultValue={ParticipantRole.DEVELOPER}
                          onValueChange={(value) => setSelectedRole(value as ParticipantRole)}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="h-8 w-[200px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <Input
                              className="mb-2"
                              placeholder="Search roles..."
                              onChange={(e) => {
                                e.preventDefault();
                                const input = e.target.value.toLowerCase();
                                setSearchRole(input ? input as ParticipantRole : null)
                              }}
                            />
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
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm border rounded-md hover:bg-secondary transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleAddParticipant}
                          disabled={!selectedRole}
                        >
                          Add to Project
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationPeople;