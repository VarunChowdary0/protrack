"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Loader2,
  Users,
  UserSearch,
} from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { User } from "@/types/userTypes"
import axiosInstance from "@/config/AxiosConfig"
import OrganizationPeople from "./widgets/OrganizationPeople"
import { Separator } from "../ui/separator"
import ParticipantWid from "./widgets/ParticipantWid"
import NotFound from "../NotFound"

const ManageParticipants = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const selPrj = useSelector((state: RootState) => state.selectedProject);
  const project = selPrj.project
  const [searchQuery, setSearchQuery] = useState("")
  const [orgUser, setOrgUser] = useState<User[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);
  const searchResults:Partial<User>[] = orgUser.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase()
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }).filter((user) => {
    // Check if the user is not already in project.participants
    return !project?.participants?.some((p) => p.user?.id === user.id)
  })



  useEffect(() => {
    const fetchOrgUsers = async () => {
      if (!auth.user?.organizationId) return
      try {
        setOrgLoading(true)
        const res = await axiosInstance(`/api/get/org/users`, {
          params: {
            orgId: auth.user.organizationId,
          }})
        setOrgUser(res.data)
      } catch (err) {
        console.error("Failed to fetch organization users", err)
      }
      finally {
        setOrgLoading(false)
      }
    }
    if (auth.user){
      fetchOrgUsers()
    }
  },[auth.user])

  if(!auth.user?.access.createProjects){
    return <NotFound/>
  }

  return (
    <Card className="border shadow-sm rounded-none min-h-screen">
      <CardHeader className="pb-4 max-sm:pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Manage Participants
          </CardTitle>
        </div>
        <CardDescription>Manage project participants and their roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" flex w-full gap-2 max-md:flex-col">
          <ScrollArea className="h-[50vh] flex-3/4 pr-4">
          {
            selPrj.isLoaded ? 
            <div className="space-y-3">
              {project?.participants && project.participants.map((participant) => (
                <ParticipantWid key={participant.id} {...participant}/>
              ))}
            </div>
            :
            <div className=" h-[80vh] flex  items-center justify-center ">
              <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
          }
          </ScrollArea>
          <Separator orientation="vertical" className="h-full" />
          <div className="space-y-4 flex-1/4 py-0">
              <div className="relative">
                <UserSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-4 min-h-[400px] max-h-screen overflow-y-auto">
                <div className="">
                  Add Participants
                </div>
                {
                  orgLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-muted-foreground">
                        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                      </span>
                    </div>
                  ) : orgUser.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-muted-foreground">No users found in organization</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-muted-foreground">No matching users found</span>
                    </div>
                  ) : 

                  searchResults.map((user) => (
                    <OrganizationPeople key={user.id} {...user}/>
                  ))
                }
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ManageParticipants