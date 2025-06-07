"use client";

import ContactList from "@/components/chat/widgets/ContactList";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function ChatLayout({ children }: { children: React.ReactNode }) {

  const isChatOpen = useSelector((state: RootState) => state.booleans.isChatOpen);
  console.log("isChatOpen", isChatOpen);
  return (
    <>
      <div className='w-full max-sm:hidden flex min-h-[calc(100vh-60px)]'>
        <ContactList/>
        <div  className={` flex-1 overflow-y-auto`}>
          {children}
        </div>
      </div>
      <div className=" hidden max-sm:block">
        {
          isChatOpen ? 
            <div className={` flex-1 overflow-y-auto`}>
                {children}
            </div>
              :
            <div className='w-full flex min-h-[calc(100vh-60px)]'>
              <ContactList/>
            </div>
        }
      </div>
    </>
  );
}