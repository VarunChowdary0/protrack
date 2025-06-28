"use client";

import InitialHeader from "@/components/headers/InitialHeader";
import NotificationRequest from "@/components/noti/notification";
import { fetchAllProjects } from "@/redux/reducers/AllProjectsReducer";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ULayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const allProjects = useSelector((state:RootState) =>  state.allProjects.isLoaded);

  useEffect(() => {
    if(!allProjects){
      dispatch(fetchAllProjects());
    }
  },[allProjects]);
  
  return (
    <>
      <InitialHeader/>
      <NotificationRequest showControls={false}/>
      <main>
        {children}
      </main>
    </>
  )
}