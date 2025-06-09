"use client"

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
import { ArchiveRestore, CheckIcon, Loader, Search, StarIcon } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type Inbox } from '@/types/inboxType'
import { mockInboxItems } from '../inboxMockData'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tooltip,TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'


const ContentsMapper:React.FC = () => {
    const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
    const [search,setSearch] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const isDarkMode = useSelector((state: RootState) => state.booleans.isDarkMode);
    const handleRowSelection = (id: string) => {
        setSelectedRows((prev) => {
            if (prev.includes(id)) {
                return prev.filter((rowId) => rowId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const isRowSelected = (id: string): boolean => selectedRows.includes(id);

    React.useEffect(() => {
        if(isDarkMode){
            ChangeThemeColor("#171717");
        }
    }, [isDarkMode]);

    const [inboxMessages, setInboxMessages] = React.useState<Inbox[]>([]);
    React.useEffect(() => {
        setIsLoading(true);
        // Simulate fetching data from an API
        setInboxMessages(mockInboxItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setIsLoading(false);
    }, []);

    const filterInboxItems = inboxMessages.filter((item) => {
        const searchTerm = search.toLowerCase();
        return (
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item?.fromUser?.firstname?.toLowerCase().includes(searchTerm) ||
            item?.fromUser?.lastname?.toLowerCase().includes(searchTerm) ||
            item.type.toLowerCase().includes(searchTerm) ||
            item.attachments?.some((attachment) =>
                attachment.name.toLowerCase().includes(searchTerm)
            ) && !item.isArchived && !item.isDeleted
        );
    });

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

    const Load = () => {
        if (isLoading) {
            return (
                <div className=' w-full h-[60vh] flex items-center justify-center'>
                    <Loader className=' animate-spin text-secondary' size={32} />
                </div>
            );
        }
        else{
            return <></>;
        }
    }

    const handleStarToggle = (id: string) => {
        setInboxMessages((prevMessages) =>
            prevMessages.map((message) =>
                message.id === id
                    ? { ...message, isStarred: !message.isStarred }
                    : message
            )
        );  
    }

    const archiveSelectedRows = () => {
        setInboxMessages((prevMessages) =>
            prevMessages.map((message) =>
                selectedRows.includes(message.id)
                    ? { ...message, isArchived: true }
                    : message
            )
        );
        setSelectedRows([]);
    };
    
  return (
    <Card className=' max-w-7xl max-sm:pb-20  !pt-0 max-sm:!pt-0 max-sm:!rounded-none max-sm:min-h-screen !gap-0 !w-full'>
        <CardHeader style={{
                        zIndex: 1000,
                    }} className=' w-full rounded-t-2xl max-sm:px-3 sticky top-0 
         dark:bg-primary-foreground gap-0 bg-background !py-4 '>
            <div className=' gap-3 flex items-center w-full py-2'>
                <div className=' relative'>
                    <Search size={14} className=' absolute top-2.5 left-3'/>
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type='text'
                        placeholder='Search inbox.. '
                        className=' w-fit rounded-full pl-8'
                    />
                </div>
               { selectedRows.length > 0 
               && <Tooltip>
                    <TooltipTrigger>
                        <Button onClick={archiveSelectedRows} size={'sm'} variant={'secondary'} >
                            <ArchiveRestore/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                        style={{ zIndex: 2000 }} 
                        className=' !w-fit !text-xs'>
                        Archive Selected
                    </TooltipContent>
                </Tooltip>}
            </div>            
        </CardHeader>
        <CardContent className=' min-h-[70vh] max-sm:!px-0'>
            <div className=' !px-0 overflow-hidden max-sm:hidden !rounded-md !border'>
                <Table>
                    <TableBody>
                        {
                            filterInboxItems.map((item)=>      
                                <TableRow className={`  
                                ${isRowSelected(item.id) ? 
                                    " dark:bg-secondary-foreground/20 bg-blue-100 hover:bg-blue-100 dark:hover:bg-secondary-foreground/20" 
                                    :
                                    `${item.seenAt.length!==0 && " text-muted-foreground bg-secondary/15" + "hover:bg-secondary/5  "}` }
                             cursor-pointer`}
                             onClick={()=>{
                            if(selectedRows.length > 0){
                                        handleRowSelection(item.id);
                                    }
                                }}                  
                                    key={item.id}>
                                    <TableCell className=' relative flex gap-2 !w-fit '>
                                        <div className=' p-2  rounded-full h-8 w-8 flex items-center justify-center 
                                        bg-transparent transition-all dark:hover:bg-[#393939] 
                                        hover:bg-blue-50 hover:border dark:hover:border-0 duration-300'
                                        onClick={()=>handleRowSelection(item.id)}>
                                            <Checkbox
                                                checked={isRowSelected(item.id)}
                                                onCheckedChange={(checked) => {
                                                    handleRowSelection(item.id);
                                                    console.log("Checkbox checked:", checked);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <Avatar>
                                            <AvatarImage 
                                                src={item.fromUser?.profilePicture}
                                                alt={`User ${item.fromUser?.firstname} Avatar`}
                                            />
                                            <AvatarFallback>
                                                {item?.fromUser?.firstname?.[0]?.toUpperCase()}{item?.fromUser?.lastname?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className=' absolute -right-10 max-[1090px]:hidden top-1'>
                                            {
                                                <StarIcon 
                                                    onClick={()=>handleStarToggle(item.id)}
                                                    size={16} 
                                                    className={`absolute top-3 right-2 cursor-pointer
                                                    ${item.isStarred ? "text-yellow-400" : "text-muted-foreground"}`}
                                                    fill={item.isStarred ? "currentColor" : "none"}
                                                />
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell className=' font-semibold !w-fit max-w-[150px] pr-3 truncate !pt-4 align-top'>
                                        <div className='w-full'>
                                            <p className=' truncate '>{item.title}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[400px]">
                                        <div className='flex flex-col gap-1'>
                                            <p className='break-words line-clamp-2 whitespace-pre-wrap'>{item.description}</p>
                                            <div className='flex items-center gap-2 flex-wrap'>
                                                {
                                                    item?.attachments?.map((attachment) => (
                                                        <div key={attachment.id} className=' text-xs text-muted-foreground'>
                                                            <Badge variant={item.seenAt.length!==0?"secondary":"default"} className={item.seenAt.length!==0 ? " text-muted-foreground" : ""}>{attachment.name}</Badge>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-xs !pr-4 dark:font-semibold">
                                        <div className=' flex items-center justify-end gap-3 '>
                                            {formatDate(item.timestamp)}
                                            <div className='  max-[1090px]:block hidden top-1'>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        {
                                                            <StarIcon 
                                                                onClick={()=>handleStarToggle(item.id)}
                                                                size={16} 
                                                                className={` cursor-pointer
                                                                ${item.isStarred ? "text-yellow-400" : "text-muted-foreground"}`}
                                                                fill={item.isStarred ? "currentColor" : "none"}
                                                            />
                                                        }
                                                    </TooltipTrigger>
                                                    <TooltipContent 
                                                        style={{ zIndex: 2000 }} 
                                                        className=' !w-fit !text-xs'>
                                                        {item.isStarred ? "Unstar" : "Star"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <Load/>
            <div className=' mt-3 hidden max-sm:flex flex-col gap-0 select-none'>
                {
                  filterInboxItems.map((item)=>
                    <div key={item.id} 
                        onTouchStart={() => {
                            touchStartTimeRef.current = Date.now();
                        }}
                        onTouchEnd={() => {
                            const touchEndTime = Date.now();
                            const duration = touchEndTime - (touchStartTimeRef.current ?? 0);

                            if (duration >= LONG_PRESS_THRESHOLD) {
                            handleRowSelection(item.id);
                            }
                        }}
                        onClick={()=>{
                            if(selectedRows.length > 0){
                                handleRowSelection(item.id);
                            }
                        }}
                        className={` py-4 ${isRowSelected(item.id) ? " dark:bg-secondary-foreground/20 bg-blue-100 " :
                             "dark:hover:bg-secondary hover:bg-blue-50/50"}  transition-all flex px-3 gap-3 items-start 
                             ${item.seenAt.length!==0 && " dark:bg-black/15 bg-[#00000007]"}
                             `}>
                        <div className='flex items-center justify-between mt-4'>

                            <Avatar className=''>
                                {
                                    isRowSelected(item.id) ?
                                    <CheckIcon/>
                                    :
                                    <>
                                        <AvatarImage 
                                            src={item.fromUser?.profilePicture}
                                            alt={`User ${item.fromUser?.firstname} Avatar`}/>
                                        <AvatarFallback className="text-black dark:text-black">
                                            {item?.fromUser?.firstname?.[0]?.toUpperCase()}{item?.fromUser?.lastname?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </>
                                }
                            </Avatar>
                            
                        </div>
                        <Card className={` !border-0 w-full !p-0  !bg-transparent !py-0 !px-0 !gap-0 !shadow-none`}>
                            <CardHeader className={` ${item.seenAt.length!==0 && " text-muted-foreground"} flex !px-0 items-center justify-between`}>
                                <div className='flex items-center gap-2'>
                                    <h3 className='text-md font-semibold '>{item.title}</h3>
                                </div>
                                <span className='text-xs dark:font-semibold '>{formatDate(item.timestamp)}</span>
                            </CardHeader>
                            <CardContent className=' !px-0 '>
                                <div className=' flex items-end'>
                                    <p className={`text-xs ${item.seenAt.length!==0 && " !text-muted-foreground"} line-clamp-2  leading-tight`}>{item.description}</p>
                                    <span>
                                        <StarIcon 
                                            onClick={()=>handleStarToggle(item.id)}
                                            size={16} 
                                            className={` cursor-pointer 
                                            ${item.isStarred ? "text-yellow-400" : "text-muted-foreground"}`}
                                            fill={item.isStarred ? "currentColor" : "none"}
                                        />
                                    </span>
                                </div>
                                {
                                    Array.isArray(item?.attachments) && item.attachments.length > 0 && (
                                        <div className='mt-2 flex flex-wrap gap-2'>
                                            {
                                                item.attachments.map((attachment) => (
                                                    <Badge key={attachment.id} 
                                                    className={`text-xs ${item.seenAt.length!==0 &&
                                                     " !opacity-40"} `}>
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
        <CardFooter>
            <Pagination className=' mt-2 w-full flex items-center justify-end'>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </CardFooter>
    </Card>
  )
}

export default ContentsMapper