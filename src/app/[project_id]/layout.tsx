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
    if (project_id && !projectState.isLoaded) {
      dispatch(fetchProject(project_id as string));
    }
  },[project_id, projectState.isLoaded]);
  if(projectState.isLoaded && projectState.project === null) {
      return <NotFound/> 
  }
  return (
    <>
      <Suspense>
        <Header/>
      </Suspense>
      <main>
        {children}
      </main>
    </>
  )
}