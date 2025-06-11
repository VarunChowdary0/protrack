"use client"
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import axiosInstance from '@/config/AxiosConfig'
import { Organization } from '@/types/organizationType'
import { signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Building2, ExternalLink, Users } from 'lucide-react'

interface UserOrganizationProps {
    organizationId: string;
}

const UserOrganization: React.FC<UserOrganizationProps> = ({ organizationId }) => {
    const [organization, setOrganization] = React.useState<Organization>();
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        if (organizationId === "1") return;
        const fetchOrgData = async () => {
            setLoading(true);
            axiosInstance.get(`/api/get/org?orgId=${organizationId}`)
            .then((orgResponse) => {
                const orgData = orgResponse.data
                setOrganization(orgData)
            })
            .catch((error) => {
                if (error.response?.status === 404) {
                    console.error("No organization:", error.response.data.action)
                    if (error.response.data.action === "LOGOUT") {
                        signOut({
                            callbackUrl: "/login",
                            redirect: true
                        });
                    }
                }
                else {
                    console.error("Error fetching organization:", error)
                }
            })
            .finally(() => {
                setLoading(false)
            })
        }
        
        if (organizationId) {
            fetchOrgData()
        }
    }, [organizationId])
    
    if (organizationId === "1") return;
    if (loading) {
        return (
            <Card className="max-sm:shadow-none max-sm:border-0 max-sm:rounded-none max-sm:border-b animate-pulse">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!organization) {
        return (
            <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50 max-sm:shadow-none max-sm:border-0 max-sm:rounded-none">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-red-700 font-semibold">Organization not found</p>
                            <p className="text-red-600 text-sm">ID: {organizationId}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-sm:shadow-none max-sm:border-0 max-sm:!p-0 max-sm:rounded-none max-sm:border-b hover:shadow-lg transition-all duration-300 ">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    {/* Organization Avatar */}
                    <div className="relative group">
                        <Avatar className=' h-20 w-20' >
                            <AvatarImage 
                                src={organization.logo} 
                                alt={`${organization.name} logo`}
                                className="object-cover"
                            />
                            <AvatarFallback className=" font-bold text-lg">
                                {organization.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Organization Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <Link 
                                    href={`/org/${organization.slug}`} 
                                    className="group inline-flex items-center space-x-2  transition-colors duration-200"
                                >
                                    <h3 className="text-3xl max-sm:text-lg mb-2 max-sm:mb-1 font-bold capitalize transition-colors">
                                        {organization.name}
                                    </h3>
                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge 
                                        variant="secondary" 
                                        className="font-mono text-xs transition-colors"
                                    >
                                        /{organization.slug}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {organization.description && (
                            <div className="mt-3">
                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                    {organization.description}
                                </p>
                            </div>
                        )}

                        {/* Additional Info Footer */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t ">
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                    <Users className="w-3 h-3" />
                                    <span>Organization</span>
                                </div>
                            </div>
                            <div className="text-xs truncate text-muted-foreground ">
                                ID: {organizationId}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default UserOrganization;