"use client";
import { Card, CardContent} from '@/components/ui/card'
import { setChatOpen, setHideBottomBar } from '@/redux/reducers/BooleanReducer';
import { LucideLock, MessageSquareLockIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const Chat:React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setChatOpen(false));
    dispatch(setHideBottomBar(true));
  },[])
  return (
    <>
      <div className=' max-sm:hidden flex-1'>
        <Card className=' relative !rounded-none w-full h-full min-h-[calc(100vh)] flex items-center justify-center'>
          <CardContent className=' flex flex-col items-center justify-center gap-4'>
            <span>
              <MessageSquareLockIcon size={64} className=' text-muted-foreground'/>
            </span>
            <div>
              <h2 className=' text-2xl'>
                Start a conversation with your contacts
              </h2>
              <p className=' text-sm text-muted-foreground text-center mt-2'>
                Select a contact from the list to begin chatting.
              </p>
            </div>
          </CardContent>
          <div className=' flex gap-2 items-center text-xs text-muted-foreground absolute bottom-40'>
            <span>
              <LucideLock size={16}/>
            </span>
            <span>End-to-End Encryption</span>
          </div>
        </Card>    
      </div>
    </>
  )
}

export default Chat