"use client";

import React, { useEffect } from 'react'
import InvitationViewer from './Views/InvitationViewer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axiosInstance from '@/config/AxiosConfig';
import { clearInboxSelection, selectInboxItem, updateInboxItem } from '@/redux/reducers/InboxReducer';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import NotFound from '@/components/NotFound';
import { InboxItemType } from '@/types/inboxType';
import MessageViewer from './Views/MessageViewer';
import { toast } from 'sonner';

const RenderMail:React.FC = () => {
    const { inbox_item } = useParams();
    const inboxItems = useSelector((state:RootState) => state.inbox.items);
    const viewItem = useSelector((state:RootState) => state.inbox.selected);
    const isLoaded = useSelector((state:RootState) => state.inbox.isLoaded);
    const dispatch = useDispatch();
    const handleStarToggle = (id: string) => {
        axiosInstance.post("/api/manage/inbox/star_item", {
            inboxId: id,
            star: !viewItem?.isStarred
        })
        .then((response) => {
            toast.success("Star toggled successfully!");
            console.log("Star toggled successfully:", response.data);
            dispatch(updateInboxItem({
                id,
                isStarred: !viewItem?.isStarred
            }));
        })
        .catch((error) => {
            toast.error("Error toggling star.");
            console.error("Error toggling star:", error);
        });
    }
    const handleArchiveItem = async (id: string) => {
        axiosInstance.post("/api/manage/inbox/archive_item", {
            inboxId: id,
            archive: !viewItem?.isArchived
        })
        .then((response) => {
            toast.success("Item archived successfully!");
            console.log("Item archived successfully:", response.data);
            dispatch(updateInboxItem({
                id,
                isArchived: !viewItem?.isArchived
            }));
        })
        .catch((error) => {
            toast.error("Error archiving item.");
            console.error("Error archiving item:", error);
        });
    }
    const handleTrashItem = async (id: string) => {
        axiosInstance.post("/api/manage/inbox/trash_item", {
            inboxId: id,
            trash: !viewItem?.isDeleted
        })
        .then((response) => {
            toast.success("Item trashed successfully!");
            console.log("Item trashed successfully:", response.data);
            dispatch(updateInboxItem({
                id,
                isDeleted: !viewItem?.isDeleted
            }));
        })
        .catch((error) => {
            toast.error("Error trashing item.");
            console.error("Error trashing item:", error);
        });
    }
    const handleItemChange = (id: string, data: { status: string; seenAt?: string; // update selected item.
         isStarred?: boolean; isArchived?: boolean; isTrashed?: boolean }) => {
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
    },[inbox_item, viewItem, isLoaded]);

    const renderBLOCK = () => {
        switch (viewItem?.type) {
            case InboxItemType.INVITE:
                return  <InvitationViewer 
                        invitation={viewItem}
                        handleArchiveItem={handleArchiveItem}
                        handleStarToggle={handleStarToggle}
                        handleTrashItem={handleTrashItem}
                        handleItemChange={handleItemChange}
                    />;
            case InboxItemType.MESSAGE:
                return <MessageViewer
                    message={viewItem}
                    handleStarToggle={handleStarToggle}
                    handleArchiveItem={handleArchiveItem}
                    handleTrashItem={handleTrashItem}
                    onReply={(email, subject) => {
                        console.log("Reply to:", email, "Subject:", subject);
                    }}/>
            default:
                return <NotFound />;
        }
    }

    useEffect(() => {
        if(viewItem?.seenAt === "") {
            axiosInstance.post("/api/manage/inbox/set_mail_seen", {
                inboxId: viewItem.id
            })
            .then((response) => {
                console.log("Mail marked as seen:", response.data);
                handleItemChange(viewItem.id, {
                    status: "seen",
                    seenAt: new Date().toISOString()
                });
            })
            .catch((error) => {
                console.error("Error marking mail as seen:", error);
            });
        }
    },[])

  return  (<div className="flex-1 flex flex-col bg-background">
    { 
    viewItem ?
        <>
            {/* Email Content */}
            <div className="flex-1 overflow-auto mybar p-0">
                {renderBLOCK()}
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
