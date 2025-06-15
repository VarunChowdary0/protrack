"use client";

import React, { useEffect } from 'react'
import InvitationViewer from './InvitationViewer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axiosInstance from '@/config/AxiosConfig';
import { clearInboxSelection, selectInboxItem, updateInboxItem } from '@/redux/reducers/InboxReducer';
import { Button } from '@/components/ui/button';
import { Archive, ArrowLeft, Loader2, StarIcon, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useParams, useRouter } from 'next/navigation';
import NotFound from '@/components/NotFound';

const RenderMail:React.FC = () => {
    const { inbox_item } = useParams();
    const inboxItems = useSelector((state:RootState) => state.inbox.items);
    const viewItem = useSelector((state:RootState) => state.inbox.selected);
    const isLoaded = useSelector((state:RootState) => state.inbox.isLoaded);
    const dispatch = useDispatch();
    const router = useRouter();
    const handleStarToggle = (id: string) => {
        axiosInstance.post("/api/manage/inbox/star_item", {
            inboxId: id,
            star: !viewItem?.isStarred
        })
        .then((response) => {
            console.log("Star toggled successfully:", response.data);
            dispatch(updateInboxItem({
                id,
                isStarred: !viewItem?.isStarred
            }));
        })
        .catch((error) => {
            console.error("Error toggling star:", error);
        });
    }
    const handleItemChange = (id: string, data: { status: string; seenAt?: string }) => {
        dispatch(updateInboxItem({
            id,
            ...data
        }));
    }

    useEffect(() => {
        if (inbox_item) {
            if(inbox_item === viewItem?.id) return;
            const item = inboxItems.find(item => item.id === inbox_item);
            if (item) {
                dispatch(clearInboxSelection());
                dispatch(selectInboxItem(item));
            }
            console.log("Selected item:", item,inboxItems);
        }
    },[inbox_item, viewItem, isLoaded])

  return  (<div className="flex-1 flex flex-col bg-background">
    { 
    viewItem ?
        <>
            <div className="p-4 border-b bg-background sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() =>{
                            dispatch(clearInboxSelection());
                            router.push("/u/inbox");
                        }}
                        className="sm:hidden"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <h1 className="text-xl font-semibold truncate flex-1">{viewItem.title}</h1>
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleStarToggle(viewItem.id)}
                                >
                                    <StarIcon 
                                        size={16} 
                                        className={viewItem.isStarred ? "text-yellow-400" : "text-muted-foreground"}
                                        fill={viewItem.isStarred ? "currentColor" : "none"}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="!text-xs">
                                {viewItem.isStarred ? "Unstar" : "Star"}
                            </TooltipContent>
                        </Tooltip>
                        <Button variant="ghost" size="sm">
                            <Archive size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-auto mybar p-0">
                    <InvitationViewer 
                    invitation={viewItem}
                    handleStarToggle={handleStarToggle}
                    handleItemChange={handleItemChange}
                />
            </div>
        </>
        :
            ( isLoaded ? 
                <div style={{
                    zIndex: 1000
                }}>
                    <NotFound/>
                </div>
            :
                <div className=' h-full flex items-center justify-center'>
                    <Loader2 className='animate-spin h-8 w-8 text-primary mx-auto' />
                </div>
            )
        }
</div>);
}

export default RenderMail;
