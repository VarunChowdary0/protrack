"use client";

import React, { useEffect } from 'react'
import InvitationViewer from './InvitationViewer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axiosInstance from '@/config/AxiosConfig';
import { clearInboxSelection, selectInboxItem, updateInboxItem } from '@/redux/reducers/InboxReducer';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import NotFound from '@/components/NotFound';

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
