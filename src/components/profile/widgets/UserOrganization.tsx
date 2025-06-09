"use client"
import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

interface UserOrganizationProps {
    organizationId: string;
}

// Mock data based on your Drizzle schema
const mockOrganizations = [
    {
        id: "1",
        name: "Default Organization",
        description: "This is the default organization",
        logo: "https://via.placeholder.com/150x150/6366f1/ffffff?text=DEF",
        slug: "default-org",
    },
    {
        id: "2", 
        name: "Tech Innovators Inc",
        description: "Leading technology solutions provider focused on innovation and digital transformation",
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA4CAMAAABuU5ChAAAA+VBMVEX////pQjU0qFNChfT6uwU0f/O4zvs6gfSJr/j6twDoOisjePPoNSXpPjDrWU/oLRr+9vZ7pff/vAAUoUAkpEn0ran619b82pT7wgD+68j947H/+e7//PafvPm/0vuBw5Df7+P63tz3xcPxl5HnJQ7qUEXxj4n4z83zoJzqSz/vgXrucWrsY1r1tbHrSBPoOjbvcSr0kx74rRH80XntZC3xhSPmGRr86+r4sk/936EJcfPS3/yowvnbwVKjsTjx9f5urEjkuBu9tC+ErkJyvoRRpj2az6hWs23j6/0emX2z2btAiuI8k8AyqkE5nZU1pGxCiOxVmtHJ5M+PSt3WAAACGElEQVRIieWSa3fSQBCGk20CJRcW2AWKxgJtqCmieNdatV5SUtFq5f//GJeE7CXJJOT4TZ+PO+c58+7MaNr/SWd60mecTDs1pMFp28dODPZnZw/369TXseXqHNfCblDdte84krTDwUFFwnMnJyXm+bSsmZ/vlcb1+6A2x5C1xYeyPgIyJlhtYDjzjOYyZA3oFighLYxni8UMY6dCG/jy9KzTQfI8DXSnTNN0kcl1lNE9dlxYC8TnnEVmAJ02qHlPllyb58vgmQ2Np0tYgzGMo2ex6IKRihi1mPhcZyYuO8McL4yYl0vrrI6mJZpx9Or1mzqa10rFt8p7o5ArXh+lXutC8d6ZBdiXvH6PeyPFsw8KMBu8fsG9+3t473l9yD1vD+/BX3v1cgqv3lzE/8A9NCUK5sn33vugeN1DQTcVTbG/9M56H+lEAzg2d54t7iW5657xCdEx5PF+B9Lj9oO9z4hBgIZX6YyaXfmZaV9QQkU781h+Hra+7jQaFv6Or8RW3r1rhErES641D9XKigox8jJaQxyAfZOpIQm6kiuT6BvfujqVuEpkkY43u+d1RBBF35v55aVJidKSEBRFiJAk/+0PM3NjgjFFMLc/WVYzlzImLBPprzvzrlBjHUmZSH8DmqatS0QSZtcjTxUBWSlZw1bckhaYlISTcm1rIqKolJJxtRWnXUVscTFsjWFFwoy7WTM2+zX69/gDaLcy7SET9nsAAAAASUVORK5CYII=",
        slug: "tech-innovators",
    },
    // ... other organizations
];

const UserOrganization: React.FC<UserOrganizationProps> = ({ organizationId }) => {
    if (organizationId === "1") return null;

    const organization = mockOrganizations.find(org => org.id === organizationId);

    if (!organization) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <p className="text-red-600 font-medium">Organization not found</p>
                    <p className="text-red-500 text-sm">No organization found with ID: {organizationId}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='max-sm:shadow-none max-sm:border-0 max-sm:rounded-none max-sm:border-b'>
            <CardHeader className="space-y-0">
                <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16">
                        <Image
                            src={organization.logo}
                            alt={`${organization.name} logo`}
                            fill
                            className="rounded-lg object-cover border border-gray-200"
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <Link href={"/org/"+organization.slug} className="text-2xl font-bold mb-1">
                            {organization.name}
                        </Link>
                        <Badge variant="secondary" className="font-mono">
                            /{organization.slug}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}

export default UserOrganization;
