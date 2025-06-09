import React, { useEffect } from 'react'
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, UserStatus } from '@/types/userTypes'
import { useState } from 'react'
import axios from 'axios'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CheckCircle, ChevronDown, Circle, CircleDot, Clock, EyeOff, MinusCircle, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { RefreshToken } from '@/lib/RefreshToken'

interface UserProp {
    user: User;
}

const statusOptions = [
    { value: UserStatus.AVAILABLE, label: 'Available' },
    { value: UserStatus.BUSY, label: 'Busy' },
    { value: UserStatus.DONOT_DISTURB, label: 'Do Not Disturb' },
    { value: UserStatus.BRB, label: 'Be Right Back' },
    { value: UserStatus.APPEAR_AWAY, label: 'Appear Away' },
    { value: UserStatus.APPEAR_OFFLINE, label: 'Appear Offline' },
    { value: UserStatus.OFFLINE, label: 'Offline' },
]

const UserDescription: React.FC<UserProp> = ({ user }) => {
    const [status, setStatus] = useState<UserStatus>(user?.status || UserStatus.AVAILABLE)
    const [isUpdating, setIsUpdating] = useState(false)
    console.log("User status:", user?.status,status)
    
    const statusIcons = {
        [UserStatus.BUSY]: <CircleDot className="h-4 w-4 text-red-500" />,
        [UserStatus.OFFLINE]: <Circle className="h-4 w-4 text-gray-500" />,
        [UserStatus.AVAILABLE]: <Circle className="h-4 w-4 text-green-500" />,
        [UserStatus.DONOT_DISTURB]: <MinusCircle className="h-4 w-4 text-red-500" />,
        [UserStatus.BRB]: <Clock className="h-4 w-4 text-yellow-500" />,
        [UserStatus.APPEAR_AWAY]: <Moon className="h-4 w-4 text-orange-500" />,
        [UserStatus.APPEAR_OFFLINE]: <EyeOff className="h-4 w-4 text-gray-500" />,
    }

    const getStatusLabel = (statusValue: UserStatus): string => {
        return statusOptions.find(option => option.value === statusValue)?.label || 'Unknown'
    }

    const handleStatusChange = async (newStatus: UserStatus) => {
        if (isUpdating || newStatus === status) return
        
        setIsUpdating(true)
        try {
            await axios.post('/api/manage/user/change_status', { 
                userId: user.id,
                status: newStatus
            })
            
            setStatus(newStatus)
            const icon = statusIcons[newStatus]
            const label = getStatusLabel(newStatus)
            
            // Refresh session to update user status
            await RefreshToken(user.email);
            
            toast.success('Status updated successfully', {
                description: (
                    <div className="flex items-center gap-2">
                        {icon}
                        <span>Your status has been changed to {label}</span>
                    </div>
                ),
            })
        } catch (error) {
            console.error('Failed to update status:', error)
            toast.error('Failed to update status', {
                description: 'There was an error updating your status. Please try again later.',
            })
        } finally {
            setIsUpdating(false)
        }
    }

    useEffect(()=>{
        setStatus(
            statusOptions.find(option => option.value === user?.status)?.value || UserStatus.AVAILABLE
        )
    },[user?.status])

    return (
        <Card className="w-full max-sm:shadow-none max-sm:gap-3 max-sm:border-0 max-sm:px-0">
            <CardHeader className="flex flex-row max-sm:px-0 items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage 
                        src={user?.profilePicture || ''} 
                        alt={`${user?.firstname} ${user?.lastname}`}
                    />
                    <AvatarFallback>
                        {user?.firstname?.[0]?.toUpperCase()}{user?.lastname?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className=" flex flex-col gap-3 flex-1">
                    <CardTitle >
                        <span className=' text-2xl max-sm:text-md'>
                            {user?.firstname} {user?.lastname}
                        </span>
                       {(user?.isEmailVerified || user?.isPhoneVerified) &&
                        <Badge className="ml-2 !px-0.5 w-4 h-4 bg-secondary-foreground capitalize">
                            <CheckCircle className=''/>
                        </Badge>}
                    </CardTitle>
                    <CardDescription>
                        <Badge className="ml-2 capitalize">
                            {user?.role}
                        </Badge>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex items-end justify-end w-full">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="capitalize w-fit max-sm:!py-1 max-sm:text-xs max-sm:shadow-none"
                            disabled={isUpdating}
                        >
                            <span className="mr-2">
                                {statusIcons[status] || <Circle className="h-4 w-4 text-gray-500" />}
                            </span>
                            {getStatusLabel(status)}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {statusOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => handleStatusChange(option.value)}
                                className="cursor-pointer"
                                disabled={option.value === status}
                            >
                                <span className="mr-2">
                                    {statusIcons[option.value] || <Circle className="h-4 w-4 text-gray-500" />}
                                </span>
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardContent>
        </Card>
    )
}

export default UserDescription