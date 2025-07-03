"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useEffect, useRef } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import ChangeThemeColor from '@/lib/ChangeThemeColor'
import { 
  ArchiveRestore, 
  BellRingIcon, 
  ChartLine, 
  CheckCircle, 
  CheckIcon, 
  Clock, 
  Loader2, 
  LucideMessageCirclePlus, 
  Search, 
  StarIcon,
  Trash2,
  Mail
} from 'lucide-react'
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
import { InboxItemType } from '@/types/inboxType'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { TaskStatus } from '@/types/taskTypes'
import axiosInstance from '@/config/AxiosConfig'
import { format, isToday, isYesterday, isThisYear, parseISO } from 'date-fns'
import {  fetchInboxItems, selectInboxItem, updateInboxItem } from '@/redux/reducers/InboxReducer'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import SentMails from './SentMails'

const InboxMapper: React.FC = () => {

    const params = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
    const [search, setSearch] = React.useState<string>("");
    const isDarkMode = useSelector((state: RootState) => state.booleans.isDarkMode);
    const inboxMessages = useSelector((state: RootState) => state.inbox.items);
    const isLoading = !useSelector((state: RootState) => state.inbox.isLoaded);
    const viewItem = useSelector((state: RootState) => state.inbox.selected);

    const [currentView, setCurrentView] = React.useState<string>("inbox");
    
    React.useEffect(() => {
        const inbox_ = params.get("inbox");
        const starred_ = params.get("starred");
        const sent_ = params.get("sent");
        const trashed_ = params.get("trash");
        const archive_ = params.get("archive");
        console.log("inbox:", inbox_, "starred:", starred_, "sent:", sent_, "trashed:", trashed_, "archive:", archive_);
        if (starred_!==null) {
            setCurrentView("starred");
        }
        else if (inbox_ !== null) {
            setCurrentView("inbox");
        } else if (sent_ !== null) {
            setCurrentView("sent");
        } else if (trashed_ !== null) {
            setCurrentView("trash");
        } else if (archive_ !== null) {
            setCurrentView("archive");
        } else {
            setCurrentView("inbox");
        } 
    }, [params]);

    
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
    useEffect(()=>{
        if(isDarkMode){
        ChangeThemeColor("#171717");
        }
    },[isDarkMode])

    // Enhanced filter function based on current view
    const filterInboxItems = inboxMessages.filter((item) => {
        const searchTerm = search.toLowerCase();
        const matchesSearch = (
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item?.fromUser?.firstname?.toLowerCase().includes(searchTerm) ||
            item?.fromUser?.lastname?.toLowerCase().includes(searchTerm) ||
            item.type.toLowerCase().includes(searchTerm) ||
            item.attachments?.some((attachment) =>
                attachment.name.toLowerCase().includes(searchTerm)
            )
        );

        // Apply view-specific filters
        switch (currentView) {
            case "inbox":
                return matchesSearch && !item.isArchived && !item.isDeleted;
            case "starred":
                return matchesSearch && item.isStarred && !item.isDeleted;
            case "archive":
                return matchesSearch && item.isArchived && !item.isDeleted;
            case "trash":
                return matchesSearch && item.isDeleted;
            case "sent":
                // For sent items, we might need a different property or API endpoint
                // For now, return empty array as it's under development
                return false;
            default:
                return matchesSearch && !item.isArchived && !item.isDeleted;
        }
    });

    const formatDate = (dateString: string) => {
        const date = parseISO(dateString);

        if (isToday(date)) {
            return format(date, 'hh:mm a');
        }

        if (isYesterday(date)) {
            return 'Yesterday';
        }

        if (!isThisYear(date)) {
            return format(date, 'MMM yyyy');
        }

        return format(date, 'MMM d');
    };

    const touchStartTimeRef = useRef<number | null>(null);
    const LONG_PRESS_THRESHOLD = 500;

    const handleStarToggle = (id: string) => {
        axiosInstance.post("/api/manage/inbox/star_item", {
            inboxId: id,
            star: !inboxMessages.find((message) => message.id === id)?.isStarred
        })
        .then((response) => {
            console.log("Star toggled successfully:", response.data);
            dispatch(updateInboxItem({
                id,
                isStarred: !inboxMessages.find((message) => message.id === id)?.isStarred
            }));
        })
        .catch((error) => {
            console.error("Error toggling star:", error);
        });
    }

    const handleArchiveItem = async (id: string,value: boolean) => {
        axiosInstance.post("/api/manage/inbox/archive_item", {
            inboxId: id,
            archive: !inboxMessages.find((message) => message.id === id)?.isArchived
        })
        .then((response) => {
            console.log("Item archived successfully:", response.data);
            dispatch(updateInboxItem({
                id,
                isArchived: value
            }));
        })
        .catch((error) => {
            console.error("Error archiving item:", error);
        });
    }
     const handleTrashItem = async (id: string, value: boolean) => {
        axiosInstance.post("/api/manage/inbox/trash_item", {
            inboxId: id,
            trash: value
        })
        .then((response) => {
            console.log("Item trashed successfully:", response.data);
            dispatch(updateInboxItem({
                id,
                isDeleted: !viewItem?.isDeleted
            }));
        })
        .catch((error) => {
            console.error("Error trashing item:", error);
        });
    }

    const archiveSelectedRows = () => {
        selectedRows.forEach(async (id) => {
            await handleArchiveItem(id, true);
            dispatch(updateInboxItem({
                id,
                isArchived: true
            }));
        });
        setSelectedRows([]);
    }


    const deleteSelectedRows = () => {
        selectedRows.forEach((id) => {
            handleTrashItem(id, true);
            dispatch(updateInboxItem({
                id,
                isDeleted: true
            }));
        });
        setSelectedRows([]);
    }

    const restoreSelectedRows = () => {
        selectedRows.forEach(async (id) => {
            handleTrashItem(id, false);
            await handleArchiveItem(id, false);
            dispatch(updateInboxItem({
                id,
                isDeleted: false,
                isArchived: false
            }));
        });
        setSelectedRows([]);
    }

    useEffect(() => {
        if (viewItem) {
            const updatedItem = inboxMessages.find(item => item.id === viewItem.id);
            dispatch(selectInboxItem(updatedItem || null));
        }
    }, [inboxMessages])

    const LoadingSpinner = () => {
        if (isLoading) {
            return (
                <div className='w-full h-[60vh] flex items-center justify-center'>
                    <Loader2 className='animate-spin' size={32} />
                </div>
            );
        }
        return null;
    }

    // Under Development Card Component
    // const UnderDevelopmentCard = () => (
    //     <div className="flex-1 flex items-center justify-center p-8">
    //         <Card className="max-w-md w-full text-center">
    //             <CardHeader className="pb-4">
    //                 <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
    //                     <Construction className="w-8 h-8 text-orange-600 dark:text-orange-400" />
    //                 </div>
    //                 <h3 className="text-xl font-semibold">Under Development</h3>
    //             </CardHeader>
    //             <CardContent>
    //                 <p className="text-muted-foreground mb-4">
    //                     The sent items feature is currently being developed and will be available soon.
    //                 </p>
    //                 <div className="text-sm text-muted-foreground">
    //                     Check back later for updates!
    //                 </div>
    //             </CardContent>
    //         </Card>
    //     </div>
    // );

    // Empty State Component
    const EmptyState = () => {
        const getEmptyStateContent = () => {
            switch (currentView) {
                case "starred":
                    return {
                        icon: <StarIcon className="w-12 h-12 text-muted-foreground" />,
                        title: "No starred items",
                        description: "Star important messages to find them here."
                    };
                case "archive":
                    return {
                        icon: <ArchiveRestore className="w-12 h-12 text-muted-foreground" />,
                        title: "No archived items",
                        description: "Archived messages will appear here."
                    };
                case "trash":
                    return {
                        icon: <Trash2 className="w-12 h-12 text-muted-foreground" />,
                        title: "Trash is empty",
                        description: "Deleted messages will appear here."
                    };
                default:
                    return {
                        icon: <LucideMessageCirclePlus className="w-12 h-12 text-muted-foreground" />,
                        title: "No messages",
                        description: "Your inbox is empty."
                    };
            }
        };

        const content = getEmptyStateContent();

        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center flex flex-col items-center ">
                    <div className="mx-auto mb-4">
                        {content.icon}
                    </div>
                    <h3 className="text-lg font-medium mb-2">{content.title}</h3>
                    <p className="text-muted-foreground">{content.description}</p>
                </div>
            </div>
        );
    };

    const renderActionButtons = () => {
        if (selectedRows.length === 0) return null;

        switch (currentView) {
            case "trash":
                return (
                    <Tooltip>
                        <TooltipTrigger>
                            <Button onClick={restoreSelectedRows} size="sm" variant="secondary">
                                <ArchiveRestore />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="!text-xs">
                            Restore Selected
                        </TooltipContent>
                    </Tooltip>
                );
            case "archive":
                return (
                    <Tooltip>
                        <TooltipTrigger>
                            <Button onClick={restoreSelectedRows} size="sm" variant="secondary">
                                <ArchiveRestore />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="!text-xs">
                            Restore Selected
                        </TooltipContent>
                    </Tooltip>
                );
            default:
                return (
                    <>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button onClick={archiveSelectedRows} size="sm" variant="secondary">
                                    <ArchiveRestore />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="!text-xs">
                                Archive Selected
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button onClick={deleteSelectedRows} size="sm" variant="secondary">
                                    <Trash2 />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="!text-xs">
                                Delete Selected
                            </TooltipContent>
                        </Tooltip>
                    </>
                );
        }
    };

    const renderInboxList = () => {
        // Show under development card for sent view
        if (currentView === "sent") {
            // return <UnderDevelopmentCard />;
            return <SentMails/>;
        }

        // Show empty state if no items after filtering
        if (filterInboxItems.length === 0 && !isLoading) {
            return <EmptyState />;
        }

        return (
            <div className="flex-1 overflow-hidden">
                {/* Search and Actions Header */}
                <div className="px-4 py-3 border-b bg-card sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-[400px]">
                            <Search size={18} className="absolute  top-3 max-sm:hidden left-3" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder={`Search ${currentView}...`}
                                className="py-5 max-sm:pl-11 rounded-full pl-10"
                            />
                        </div>
                        {renderActionButtons()}
                        <Tooltip>
                            <TooltipTrigger>
                                <div onClick={()=>   dispatch(fetchInboxItems())} className={`${isLoading && "animate-spin"} p-2 rounded-full hover:bg-secondary cursor-pointer`}>
                                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                                        <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                                    </svg>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="!text-xs">
                                Refresh Inbox
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Desktop Inbox List */}
                <div className="overflow-auto max-sm:hidden">
                    <Table>
                        <TableBody>
                            {filterInboxItems.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className={`cursor-pointer transition-colors ${
                                        viewItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : 
                                        isRowSelected(item.id) ? 
                                            "dark:bg-secondary-foreground/20 bg-blue-100 hover:bg-blue-100 dark:hover:bg-secondary-foreground/20" 
                                            :
                                            `${item.seenAt.length !== 0 && "text-muted-foreground bg-secondary/15 hover:bg-secondary/5"}`
                                    }`}
                                    onClick={() => {
                                        if (selectedRows.length > 0) {
                                            handleRowSelection(item.id);
                                        } else {
                                            dispatch(selectInboxItem(item));
                                        }
                                    }}
                                >
                                    <TableCell className="relative flex gap-2 !w-fit">
                                        <div
                                         className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-transparent transition-all dark:hover:bg-[#393939] hover:bg-blue-50 hover:border dark:hover:border-0 duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRowSelection(item.id);
                                            }}>
                                            <Checkbox
                                                checked={isRowSelected(item.id)}
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
                                    </TableCell>
                                    <TableCell className="font-semibold !w-fit max-w-[150px] pr-3 truncate !pt-4 align-top">
                                        <Link href={`mail/${item.id}`}
                                             className="w-full">
                                            <p className="truncate">{item.title}</p>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="max-w-[550px]">
                                        <Link href={`mail/${item.id}`} className="flex flex-col gap-1">
                                            <p className="break-words line-clamp-2 text-muted-foreground whitespace-pre-wrap">{item.description}</p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {item?.attachments?.map((attachment) => (
                                                    <div key={attachment.id} className="text-xs text-muted-foreground">
                                                        <Badge variant={item.seenAt.length !== 0 ? "secondary" : "default"} className={item.seenAt.length !== 0 ? "text-muted-foreground" : ""}>
                                                            {attachment.name}
                                                        </Badge>
                                                    </div>
                                                ))}         
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`inbox/${item.id}`} className="flex items-center justify-end gap-2">
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
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right text-xs !pr-4 dark:font-semibold">
                                        <div className="flex items-center justify-end gap-3">
                                            {formatDate(item.timestamp)}
                                            {currentView !== "trash" && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <StarIcon 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStarToggle(item.id);
                                                            }}
                                                            size={16} 
                                                            className={`cursor-pointer ${item.isStarred ? "text-yellow-400" : "text-muted-foreground"}`}
                                                            fill={item.isStarred ? "currentColor" : "none"}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="!text-xs">
                                                        {item.isStarred ? "Unstar" : "Star"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Inbox List */}
                <div className="mt-0 flex max-sm:flex flex-col gap-0 select-none sm:hidden">
                    {filterInboxItems.map((item) => (
                        <div 
                            key={item.id}
                            className={`py-4 transition-all flex px-3 gap-3 items-start cursor-pointer ${
                                viewItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20' :
                                isRowSelected(item.id) ? "dark:bg-secondary-foreground/20 bg-blue-100" :
                                "dark:hover:bg-secondary hover:bg-blue-50/50"
                            } ${item.seenAt.length !== 0 && "dark:bg-black/15 bg-[#00000007]"}`}
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
                            onClick={() => {
                                if (selectedRows.length > 0) {
                                    handleRowSelection(item.id);
                                } else {
                                    dispatch(selectInboxItem(item));
                                    router.push(`/u/mail/${item.id}`);
                                }
                            }}
                        >
                            <div className="flex items-center justify-between mt-4">
                                <Avatar>
                                    {isRowSelected(item.id) ? (
                                        <CheckIcon/>
                                    ) : (
                                        <>
                                            <AvatarImage 
                                                src={item.fromUser?.profilePicture}
                                                alt={`User ${item.fromUser?.firstname} Avatar`}
                                            />
                                            <AvatarFallback className="text-black dark:text-black">
                                                {item?.fromUser?.firstname?.[0]?.toUpperCase()}{item?.fromUser?.lastname?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                            </div>
                            <Card className="!border-0 w-full !p-0 !bg-transparent !py-0 !px-0 !gap-0 !shadow-none">
                                <CardHeader className={`${item.seenAt.length !== 0 && "text-muted-foreground"} flex !px-0 items-center justify-between`}>
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
                                    <div className="flex items-end justify-between gap-2">
                                        <p className="text-xs !text-muted-foreground line-clamp-2 leading-tight text-wrap min-w-0">{item.description.substring(0,130)}</p>
                                        {currentView !== "trash" && (
                                            <span className="flex-shrink-0">
                                                <StarIcon 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStarToggle(item.id);
                                                    }}
                                                    size={16} 
                                                    className={`cursor-pointer ${item.isStarred ? "text-yellow-400" : "text-muted-foreground"}`}
                                                    fill={item.isStarred ? "currentColor" : "none"}
                                                />
                                            </span>
                                        )}
                                    </div>
                                    {Array.isArray(item?.attachments) && item.attachments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {item.attachments.map((attachment) => (
                                                <Badge 
                                                    key={attachment.id}
                                                    className={`text-xs ${item.seenAt.length !== 0 && "!opacity-40"}`}
                                                >
                                                    {attachment.name} - {attachment.size}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                <LoadingSpinner />

                {/* Pagination */}
                {filterInboxItems.length > 0 && (
                    <div className="p-4 border-t">
                        <Pagination className="w-full flex items-center justify-end">
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
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen max-w-full bg-background">
            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Inbox List - Show on mobile when no item selected, or always on desktop */}
                <div className={` flex w-full flex-col border-r`}>
                    {renderInboxList()}
                </div>
            </div>
        </div>
    );
}

export default InboxMapper