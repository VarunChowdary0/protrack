"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useRef } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ChangeThemeColor from '@/lib/ChangeThemeColor'

const mockData = [
    {
        id: 88,
        senderId: 10,
        title: "Today's Invoice",   
        description: "Please review your invoice for the month of September.",
        attcachments: [
            {
                id: 1,
                name: "Invoice_September.pdf",
                type: "application/pdf",
                size: "1.2 MB"
            }
        ],
        timestamp: "2025-06-05T10:00:00Z",
        seenAt: "",
        isArchived: false,
        isStarred: false,
        isDeleted: false,
    },
    {
        id: 1,
        senderId: 1,
        title: "Review your invoice",
        description: "Please review your invoice for the month of September.",
        attcachments: [
            {
                id: 1,
                name: "Invoice_September.pdf",
                type: "application/pdf",
                size: "1.2 MB"
            }
        ],
        timestamp: "2025-05-29T10:00:00Z",
        seenAt: "",
        isArchived: false,
        isStarred: false,
        isDeleted: false,
    },
    {
        id: 2,
        senderId: 2,
        title: "Meeting Agenda - Next Week",
        description: "Please find attached the agenda for the upcoming team meeting.",
        attcachments: [
            {
                id: 2,
                name: "Agenda_June.pdf",
                type: "application/pdf",
                size: "850 KB"
            }
        ],
        timestamp: "2025-06-01T15:30:00Z",
        seenAt: "2025-06-02T08:45:00Z",
        isArchived: false,
        isStarred: true,
        isDeleted: false,
    },
    {
        id: 3,
        senderId: 3,
        title: "Performance Review Summary",
        description: "Your quarterly performance review summary is now available.",
        attcachments: [],
        timestamp: "2025-05-28T12:15:00Z",
        seenAt: "",
        isArchived: false,
        isStarred: false,
        isDeleted: false,
    },
    {
        id: 4,
        senderId: 4,
        title: "Holiday Announcement",
        description: "The office will remain closed on 14th June due to public holiday.",
        attcachments: [],
        timestamp: "2025-06-03T09:00:00Z",
        seenAt: "2025-06-03T09:45:00Z",
        isArchived: true,
        isStarred: false,
        isDeleted: false,
    },
    {
        id: 5,
        senderId: 5,
        title: "System Maintenance Notification",
        description: "Scheduled system maintenance will occur this Saturday from 1 AM to 3 AM.",
        attcachments: [],
        timestamp: "2025-06-04T18:30:00Z",
        seenAt: "",
        isArchived: false,
        isStarred: false,
        isDeleted: true,
    },
    {
        id: 6,
        senderId: 6,
        title: "Project Update Required",
        description: "Please update the project timeline and upload the latest report.",
        attcachments: [
            {
                id: 3,
                name: "Timeline_Update.xlsx",
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                size: "320 KB"
            }
        ],
        timestamp: "2025-06-05T07:45:00Z",
        seenAt: "2025-06-05T08:15:00Z",
        isArchived: false,
        isStarred: true,
        isDeleted: false,
    },
    {
        id: 7,
        senderId: 7,
        title: "Client Feedback - Action Needed",
        description: "Client has provided feedback on the recent deployment. Please review and act accordingly.",
        attcachments: [
            {
                id: 4,
                name: "Client_Feedback.docx",
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                size: "500 KB"
            }
        ],
        timestamp: "2025-06-02T11:20:00Z",
        seenAt: "2025-06-02T12:00:00Z",
        isArchived: false,
        isStarred: false,
        isDeleted: false,
    },
    {
        id: 8,
        senderId: 8,
        title: "Weekly Newsletter",
        description: "Check out what's new this week in your organization.",
        attcachments: [],
        timestamp: "2025-06-05T06:00:00Z",
        seenAt: "",
        isArchived: false,
        isStarred: false,
        isDeleted: false,
    },
    {
        id: 9,
        senderId: 9,
        title: "Password Expiration Notice",
        description: "Your password will expire in 5 days. Please update it to avoid access issues.Your password will expire in 5 days. Please update it to avoid access issues.Your password will expire in 5 days. Please update it to avoid access issues.Your password will expire in 5 days. Please update it to avoid access issues.",
        attcachments: [],
        timestamp: "2025-06-04T13:15:00Z",
        seenAt: "",
        isArchived: false,
        isStarred: false,
        isDeleted: false,
    },
    {
        id: 10,
        senderId: 10,
        title: "Travel Reimbursement Approved",
        description: "Your travel reimbursement has been approved. See attached receipt summary.",
        attcachments: [
            {
                id: 5,
                name: "Reimbursement_Receipt.pdf",
                type: "application/pdf",
                size: "450 KB"
            }
        ],
        timestamp: "2025-06-01T17:50:00Z",
        seenAt: "2025-06-01T18:10:00Z",
        isArchived: false,
        isStarred: true,
        isDeleted: false,
    }
];



const ContentsMapper:React.FC = () => {
    const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
    const isDarkMode = useSelector((state: RootState) => state.booleans.isDarkMode);
    const handleRowSelection = (id: number) => {
        setSelectedRows((prev) => {
            if (prev.includes(id)) {
                return prev.filter((rowId) => rowId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const isRowSelected = (id: number): boolean => selectedRows.includes(id);
    // const handleCheckboxChange = (checked: boolean, id: number) => {
    //     if (checked) {
    //         setSelectedRows((prev) => [...prev, id]);
    //     } else {
    //         setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    //     }
    // };

    React.useEffect(() => {
        if(isDarkMode){
            ChangeThemeColor("#171717");
        }
    }, [isDarkMode]);

    const [inboxMessages, setInboxMessages] = React.useState([] as typeof mockData);
    React.useEffect(() => {
        // Simulate fetching data from an API
        setInboxMessages(mockData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        // Same day
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        }

        // Yesterday
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        // Different year
        if (date.getFullYear() !== now.getFullYear()) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
            });
        }

        // Same year, different day
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

      const touchStartTimeRef = useRef<number | null>(null);
    const LONG_PRESS_THRESHOLD = 500; // in milliseconds

    
  return (
    <Card className=' max-w-6xl max-sm:!pt-0 max-sm:!rounded-none max-sm:min-h-screen !gap-0 !w-full'>
        <CardHeader style={{
                        zIndex: 1000,
                    }} className=' w-full max-sm:px-3 sticky top-0 
         dark:bg-primary-foreground gap-0 bg-background '>
            <div className='flex flex-col gap-0 py-4'>
                <h2 className='text-2xl font-semibold'>Inbox</h2>
                <p className='text-muted-foreground max-sm:hidden'>Here you can find all your messages and notifications.</p>
            </div>
        </CardHeader>
        <hr className=' my-4 mx-5 max-sm:hidden'/>
        <CardContent className='  max-sm:!px-0'>
            <div className=' !px-0 overflow-hidden max-sm:hidden !rounded-md !border'>
                <Table>
                    <TableBody>
                        {
                            inboxMessages.map((message)=>      
                                <TableRow className={`  
                                ${isRowSelected(message.id) ? 
                                    " dark:bg-secondary-foreground/20 bg-blue-100 hover:bg-blue-100 dark:hover:bg-secondary-foreground/20" 
                                    :
                                    `${message.seenAt.length!==0 && " text-muted-foreground bg-secondary/15" + "hover:bg-secondary/5  "}` }
                             cursor-pointer`}                              
                            //  onDoubleClick={() => handleRowSelection(message.id)}
                                    key={message.id}>
                                    <TableCell
                                        className=' group'
                                        onClick={()=>handleRowSelection(message.id)}>
                                        <div className=' p-2  rounded-full h-8 w-8 flex items-center justify-center 
                                        bg-transparent transition-all dark:group-hover:bg-[#393939] 
                                        group-hover:bg-blue-50 group-hover:border dark:group-hover:border-0 duration-300'>
                                            <Checkbox
                                                checked={isRowSelected(message.id)}
                                                onCheckedChange={(checked) => {
                                                    handleRowSelection(message.id);
                                                    console.log("Checkbox checked:", checked);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className=' font-semibold !w-fit max-w-[230px]'>
                                        <p className='max-w-[240px]'>{message.title}</p>
                                    </TableCell>
                                    <TableCell className="max-w-[400px]">
                                        <div className='flex flex-col gap-1'>
                                            <p className='break-words line-clamp-2 whitespace-pre-wrap'>{message.description}</p>
                                            <div className='flex items-center gap-2 flex-wrap'>
                                                {
                                                    message.attcachments.map((attachment) => (
                                                        <div key={attachment.id} className=' text-xs text-muted-foreground'>
                                                            <Badge variant={message.seenAt.length!==0?"secondary":"default"} className={message.seenAt.length!==0 ? " text-muted-foreground" : ""}>{attachment.name}</Badge>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-xs dark:font-semibold">{formatDate(message.timestamp)}</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <div className=' !px-0 overflow-hidden max-sm:hidden !rounded-md !border'>
                <Table>
                    <TableBody>
                        {
                            inboxMessages.map((message)=>      
                                <TableRow className={`  
                                ${isRowSelected(message.id) ? 
                                    " dark:bg-secondary-foreground/20 bg-blue-100 hover:bg-blue-100 dark:hover:bg-secondary-foreground/20" 
                                    :
                                    `${message.seenAt.length!==0 && " text-muted-foreground bg-secondary/15" + "hover:bg-secondary/5  "}` }
                             cursor-pointer`}                              
                            //  onDoubleClick={() => handleRowSelection(message.id)}
                                    key={message.id}>
                                    <TableCell
                                        className=' group'
                                        onClick={()=>handleRowSelection(message.id)}>
                                        <div className=' p-2  rounded-full h-8 w-8 flex items-center justify-center 
                                        bg-transparent transition-all dark:group-hover:bg-[#393939] 
                                        group-hover:bg-blue-50 group-hover:border dark:group-hover:border-0 duration-300'>
                                            <Checkbox
                                                checked={isRowSelected(message.id)}
                                                onCheckedChange={(checked) => {
                                                    handleRowSelection(message.id);
                                                    console.log("Checkbox checked:", checked);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className=' font-semibold !w-fit max-w-[230px]'>
                                        <p className='max-w-[240px]'>{message.title}</p>
                                    </TableCell>
                                    <TableCell className="max-w-[400px]">
                                        <div className='flex flex-col gap-1'>
                                            <p className='break-words line-clamp-2 whitespace-pre-wrap'>{message.description}</p>
                                            <div className='flex items-center gap-2 flex-wrap'>
                                                {
                                                    message.attcachments.map((attachment) => (
                                                        <div key={attachment.id} className=' text-xs text-muted-foreground'>
                                                            <Badge variant={message.seenAt.length!==0?"secondary":"default"} className={message.seenAt.length!==0 ? " text-muted-foreground" : ""}>{attachment.name}</Badge>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-xs dark:font-semibold">{formatDate(message.timestamp)}</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <div className=' mt-3 pb-10 hidden max-sm:flex flex-col gap-0 select-none'>
                {
                  inboxMessages.map((message)=>
                    <div key={message.id} 
                        onTouchStart={() => {
                            touchStartTimeRef.current = Date.now();
                        }}
                        onTouchEnd={() => {
                            const touchEndTime = Date.now();
                            const duration = touchEndTime - (touchStartTimeRef.current ?? 0);

                            if (duration >= LONG_PRESS_THRESHOLD) {
                            handleRowSelection(message.id);
                            }
                        }}
                //   onDoubleClick={()=>handleRowSelection(message.id)} 
className={` py-4 ${isRowSelected(message.id) ? " dark:bg-secondary-foreground/20 bg-blue-100 " : "dark:hover:bg-secondary hover:bg-blue-50"}  transition-all flex px-3 gap-3 items-start`}>
                        <div className='flex items-center justify-between mt-4'>
                            <Checkbox
                                checked={isRowSelected(message.id)}
                                onCheckedChange={(checked) => {
                                    handleRowSelection(message.id);
                                    console.log("Checkbox checked:", checked);
                                }}
                            />
                        </div>
                        <Card className=' !border-0 w-full !p-0 !bg-transparent !py-0 !px-0 !gap-0 !shadow-none'>
                            <CardHeader className={` ${message.seenAt.length!==0 && " text-muted-foreground"} flex !px-0 items-center justify-between`}>
                                <div className='flex items-center gap-2'>
                                    {/* <span className='text-md rounded-full bg-secondary px-2 font-bold'>i</span> */}
                                    <h3 className='text-md font-semibold pl-3.5'>{message.title}</h3>
                                </div>
                                <span className='text-xs dark:font-semibold '>{formatDate(message.timestamp)}</span>
                            </CardHeader>
                            <CardContent className=' !px-0 '>
                                <p className={`text-xs ${message.seenAt.length!==0 && " !text-muted-foreground"} line-clamp-2  leading-tight`}>{message.description}</p>
                                {
                                    message.attcachments.length > 0 && (
                                        <div className='mt-2 flex flex-wrap gap-2'>
                                            {
                                                message.attcachments.map((attachment:{
                                                    id: number;
                                                    name: string;
                                                    type: string;
                                                    size: string;
                                                }) => (
                                                    <Badge key={attachment.id} className={`text-xs ${message.seenAt.length!==0 && " !opacity-40"} `}>
                                                        {attachment.name} - {attachment.size}
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </div>
                )
                
                }


            </div>
        </CardContent>
    </Card>
  )
}

export default ContentsMapper