"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { 
  BellRingIcon, 
  ChartLine, 
  CheckCircle, 
  Clock, 
  Loader2, 
  LucideMessageCirclePlus, 
  Mail
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Inbox, InboxItemType } from '@/types/inboxType'
import { TaskStatus } from '@/types/taskTypes'
import axiosInstance from '@/config/AxiosConfig'

const SentMails = () => {
    const [sentMails, setSentMails] = useState<Inbox[]>();

    useEffect(() => {
        axiosInstance.get('/api/get/inbox/sent')
            .then((res) => {
                setSentMails(res.data.sort((a: Inbox, b: Inbox) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                ));
            })
            .catch((err) => {
                console.error("Error fetching sent mails:", err);
            });
    }, []);

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!sentMails) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className=' max-h-screen overflow-y-auto'>
            <div className=' sticky top-3 z-10 hidden max-sm:block left-5 h-10 bg-card w-12 rounded-full '></div>
            {/* Desktop Table View */}
            <div className="overflow-auto max-sm:hidden">
                <Table>
                    <TableBody>
                        {sentMails.map((item) => (
                            <TableRow
                                key={item.id}
                                className={`hover:bg-secondary/5 ${
                                    false && "text-muted-foreground bg-secondary/15"
                                }`}
                            >
                                <TableCell className="relative flex gap-2 !w-fit">
                                    <Avatar>
                                        <AvatarImage 
                                            src={item.fromUser?.profilePicture}
                                            alt={`User ${item.fromUser?.firstname} Avatar`}
                                        />
                                        <AvatarFallback>
                                            {item?.fromUser?.firstname?.[0]?.toUpperCase()}{item?.fromUser?.lastname?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-semibold !w-fit max-w-[150px] pr-3 truncate !pt-4 align-top">
                                    <p className="truncate">{item.title}</p>
                                </TableCell>
                                <TableCell className="max-w-[550px]">
                                    <div className="flex flex-col gap-1">
                                        <p className="break-words line-clamp-2 text-muted-foreground whitespace-pre-wrap">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {item?.attachments?.map((attachment,idx) => (
                                                <div key={attachment.id} className="text-xs text-muted-foreground">
                                                    <Badge variant={false ? "secondary" : "default"} 
                                                          className={ false ? "text-muted-foreground" : ""}>
                                                        {attachment?.document?.name || `Attachment ${idx+1}`}
                                                    </Badge>
                                                </div>
                                            ))}         
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <Badge variant="outline" className="!px-0 w-5 h-5 flex items-center justify-center rounded-full capitalize">
                                            {item.type === InboxItemType.INVITE && <LucideMessageCirclePlus/>}
                                            {item.type === InboxItemType.NOTIFICATION && <BellRingIcon className="text-teal-500"/>}
                                            {item.type === InboxItemType.MESSAGE && <Mail className="text-indigo-500"/>}
                                            {item.type === InboxItemType.TASK && (
                                                (item?.task?.status === TaskStatus.PENDING && <Clock className="text-orange-500"/>) ||
                                                (item?.task?.status === TaskStatus.IN_PROGRESS && <ChartLine className="text-blue-400"/>) ||
                                                (item?.task?.status === TaskStatus.COMPLETED && <CheckCircle className="text-green-500"/>)
                                            )}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-xs !pr-4 dark:font-semibold">
                                    {formatDate(item.timestamp)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="mt-0 max-sm:flex flex-col gap-0 mb-20 overflow-y-auto sm:hidden">
                {sentMails.map((item) => (
                    <div key={item.id}>
                        <div className={`py-4 px-3 gap-3 flex items-start ${
                            false ? "dark:bg-black/15 bg-[#00000007]" : ""
                        }`}>
                            <div className="flex z-[1] items-center justify-between mt-4">
                                <Avatar>
                                    <AvatarImage 
                                        src={item.fromUser?.profilePicture}
                                        alt={`User ${item.fromUser?.firstname} Avatar`}
                                    />
                                    <AvatarFallback className="text-black dark:text-black">
                                        {item?.fromUser?.firstname?.[0]?.toUpperCase()}{item?.fromUser?.lastname?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <Card className="!border-0 w-full !p-0 !bg-transparent !py-0 !px-0 !gap-0 !shadow-none">
                                <CardHeader className={`${false && "text-muted-foreground"} flex !px-0 items-center justify-between`}>
                                    <div className="flex items-center justify-between w-[80%] gap-2">
                                        <h3 className="text-md font-semibold">{item.title}</h3>
                                        <Badge variant="outline" className="!px-0 w-5 h-5 flex items-center justify-center rounded-full capitalize">
                                            {item.type === InboxItemType.INVITE && <LucideMessageCirclePlus/>}
                                            {item.type === InboxItemType.NOTIFICATION && <BellRingIcon className="text-teal-500"/>}
                                            {item.type === InboxItemType.MESSAGE && <Mail className="text-indigo-500"/>}
                                            {item.type === InboxItemType.TASK && (
                                                (item?.task?.status === TaskStatus.PENDING && <Clock className="text-orange-500"/>) ||
                                                (item?.task?.status === TaskStatus.IN_PROGRESS && <ChartLine className="text-blue-400"/>) ||
                                                (item?.task?.status === TaskStatus.COMPLETED && <CheckCircle className="text-green-500"/>)
                                            )}
                                        </Badge>
                                    </div>
                                    <span className="text-xs dark:font-semibold">
                                        {formatDate(item.timestamp)}
                                    </span>
                                </CardHeader>
                                <CardContent className="!px-0">
                                    <p className="text-xs !text-muted-foreground line-clamp-2 leading-tight text-wrap min-w-0">
                                        {item.description.substring(0,130)}
                                    </p>
                                    {Array.isArray(item?.attachments) && item.attachments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {item.attachments.map((attachment,idx) => (
                                                <Badge 
                                                    key={attachment.id}
                                                    className={`text-xs ${false && "!opacity-40"}`}
                                                >
                                                    {attachment?.document?.name || `Attachment ${idx+1}`}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SentMails