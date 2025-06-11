"use client"
import axiosInstance from '@/config/AxiosConfig';
import { Organization } from '@/types/organizationType';
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Building2, 
  CalendarDays, 
  Loader2,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ChangeThemeColor from '@/lib/ChangeThemeColor';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export const AllOrganizations = () => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [orgs, setOrganizations] = useState<Organization[]>([]); 
    const auth = useSelector((state: RootState) => state.auth);
    const isDarkMode = useSelector((state:RootState)=> state.booleans.isDarkMode)
    
    useEffect(()=>{
        if(isDarkMode){
            ChangeThemeColor("#171717");
        }
    },[isDarkMode])

    const fetchOrgData = () => {
        setLoading(true);
        setError(null);
        axiosInstance.get("/api/get/org/all")
        .then((res) => {
            setOrganizations(res.data);
        })
        .catch((err) => {
            console.error(err);
            setError("Failed to load organizations. Please try again later.");
        })
        .finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchOrgData();
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-transparent shadow-none border-none">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-sm text-muted-foreground">Loading organizations...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full shadow-none border-none max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
                        <p className="text-sm text-muted-foreground text-center">{error}</p>
                        <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => fetchOrgData()}
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!orgs?.length) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <Building2 className="h-8 w-8 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground">No organizations found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 lg:p-6">
            <div className="w-full max-w-7xl mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader className="px-4 lg:px-6">
                        <CardTitle className="text-xl lg:text-2xl font-bold flex items-center gap-2">
                            <Building2 className="h-5 w-5 lg:h-6 lg:w-6" />
                            Organizations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 lg:px-6">
                        {/* Mobile Card View */}
                        <div className="block lg:hidden space-y-4">
                            {orgs.map((org) => (
                                <Card key={org.id} className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start relative justify-between">
                                            <Link href={"/org/"+org.slug} className="flex items-center  gap-3 flex-1">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={org.logo || ''} alt={org.name} />
                                                    <AvatarFallback>
                                                        {org.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold capitalize truncate">{org.name}</div>
                                                    <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                                                        ID: {org.id}
                                                    </div>
                                                </div>
                                            </Link>
                                            <DropdownMenu >
                                                <DropdownMenuTrigger className=' absolute top-0 right-0' asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        disabled={!auth.user?.access?.manageOrganization}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        disabled={!auth.user?.access?.manageOrganization}
                                                        className="flex items-center gap-2 text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {org.description || 'No description'}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <Link href={"/org/"+org.slug}>
                                                    <Badge variant={'secondary'} className="text-xs">
                                                        /{org.slug || "NA"}
                                                    </Badge>
                                                </Link>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <CalendarDays className="h-3 w-3" />
                                                    <span>
                                                        {org.createdAt && org.createdAt !== "null" 
                                                            ? format(new Date(org.createdAt), 'MMM d, yyyy')
                                                            : 'N/A'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block">
                            <div className="rounded-md overflow-hidden border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-[#f0f0f0] dark:bg-[#333333]">
                                            <TableHead className="w-[250px]">Organization</TableHead>
                                            <TableHead className="max-w-[300px]">Description</TableHead>
                                            <TableHead className="w-[120px]">Slug</TableHead>
                                            <TableHead className="w-[140px]">Created</TableHead>
                                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orgs.map((org) => (
                                            <TableRow key={org.id}>
                                                <TableCell>
                                                    <Link href={"/org/"+org.slug} className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                                            <AvatarImage src={org.logo || ''} alt={org.name} />
                                                            <AvatarFallback>
                                                                {org.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="capitalize font-semibold truncate">{org.name}</div>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <div className="text-xs text-muted-foreground max-w-[150px] truncate">
                                                                        ID: {org.id}
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {org.id}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="max-w-[300px]">
                                                    <p className="text-wrap line-clamp-3 text-sm text-muted-foreground">
                                                        {org.description || 'No description'}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={"/org/"+org.slug}>
                                                        <Badge variant={'secondary'}>
                                                            /{org.slug || "NA"}
                                                        </Badge>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                        <span className="text-sm">
                                                            {org.createdAt && org.createdAt !== "null" 
                                                                ? format(new Date(org.createdAt), 'MMM d, yyyy')
                                                                : 'N/A'
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                disabled={!auth.user?.access?.manageOrganization}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={!auth.user?.access?.manageOrganization}
                                                                className="flex items-center gap-2 text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}