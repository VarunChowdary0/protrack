"use client";
import Header from "@/components/headers/Header";
import NotFound from "@/components/NotFound";
import { fetchProject } from "@/redux/reducers/SelectedProject";
import { AppDispatch, RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import { Suspense, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {project_id} = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const projectState = useSelector((state: RootState) => state.selectedProject);
  useEffect(() => {
    if (project_id && projectState.project?.id !== project_id ) {
      dispatch(fetchProject(project_id as string));
      console.log("need load");
    }
    else{
      console.log("no need load");
    }
  },[project_id, projectState.isLoaded]);
  if(projectState.isLoaded && projectState.project === null) {
      return <NotFound/> 
  }
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header/>
      </Suspense>
      <main>
        {children}
      </main>
    </>
  )
}