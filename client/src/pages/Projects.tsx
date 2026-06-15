import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types'

import {
  ArrowBigDownDashIcon,
  EyeIcon,
  EyeOffIcon,
  FullscreenIcon,
  LaptopIcon,
  Loader2Icon,
  MessagesSquareIcon,
  SaveIcon,
  SmartphoneIcon,
  TabletIcon,
  XIcon
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview'
import api from '@/configs/axios'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

const Projects = () => {

  const { projectId } = useParams()
 
  const navigate = useNavigate()
  const {data: session, isPending} = authClient.useSession()

  const [project, setProject] = useState<Project | null>(null)

  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop')

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

 const previewRef = useRef<ProjectPreviewRef | null>(null)
  const fetchProject = async () => {
    try{
      const { data } = await api.get(`/api/user/project/${projectId}`);

      if (!data.project) {
      toast.error("Project not found");
      return;
   }

setProject(data.project);
setIsGenerating(!data.project.current_code);
    } catch (error : any) {
      toast.error(error?.response?.data?.message || error.message);
      console.error( error);
    }finally {
    setLoading(false);
  }
  }

  const saveProject = async () => {

    if(!previewRef.current) return;
    const code = previewRef.current.getCode();
    if(!code) return;
    setIsSaving(true);
    try {
      const { data } = await api.put(`/api/project/save/${projectId}`, {code});
      toast.success(data.message)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    } finally{
      setIsSaving(false)
    }

  }

  const downloadCode = () => {
     const code = previewRef.current?.getCode() || project?.current_code;
     if(!code){
      if(isGenerating){
        return
      }
      return
     }
     const element = document.createElement('a');
     const file = new Blob([code], {type: 'text/html'});
     element.href = URL.createObjectURL(file)
     element.download = "index.html";
     document.body.appendChild(element)
     element.click();
  }

  const togglePublish = async () => {
     try {
      const { data } = await api.put(`/api/user/publish-toggle/${projectId}`);
      console.log(data)
      console.log(projectId)
      toast.success(data.message)
      setProject((prev) => prev ? ({...prev, isPublished: !prev.isPublished}) : null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
  }
}

  useEffect(() => {
    if(session?.user){
      fetchProject();
    } else if(!isPending && !session?.user){
      navigate('/');
      toast.error('Please login to view your projects')
    }
  }, [session?.user])

  useEffect(() => {
    if(project && !project.current_code){
      const intervalId = setInterval(fetchProject, 10000) 
      return () => clearInterval(intervalId)
    }
  }, [project])

  if (loading) {

    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-900'>
        <Loader2Icon className='size-7 animate-spin text-violet-200' />
      </div>
    )
  }

  return project ? (

    <div className='flex flex-col h-screen w-full bg-gray-900 text-white overflow-hidden'>

      {/* TOP NAVBAR */}
<div className='flex max-sm:flex-col sm:items-center justify-between gap-4 px-4 py-3 border-b border-gray-800'>

  {/* LEFT */}
  {/* LEFT */}
<div className='flex items-center gap-4 min-w-0'>

  {/* LOGO + TITLE */}
  <div className='flex items-center gap-3 min-w-0'>

    <img
      src="/favicon.svg"
      alt="logo"
      className='h-6 cursor-pointer'
      onClick={() => navigate('/')}
    />

    <div className='min-w-0'>
      <p className='text-sm font-medium capitalize truncate'>
        {project.name}
      </p>

      <p className='text-xs text-gray-400'>
        Previewing last saved version
      </p>
    </div>

  </div>

  {/* DEVICE SWITCH */}
  <div className='hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md'>

    <SmartphoneIcon
      onClick={() => setDevice('phone')}
      className={`size-6 p-1 rounded cursor-pointer ${
        device === 'phone' ? 'bg-gray-700' : ''
      }`}
    />

    <TabletIcon
      onClick={() => setDevice('tablet')}
      className={`size-6 p-1 rounded cursor-pointer ${
        device === 'tablet' ? 'bg-gray-700' : ''
      }`}
    />

    <LaptopIcon
      onClick={() => setDevice('desktop')}
      className={`size-6 p-1 rounded cursor-pointer ${
        device === 'desktop' ? 'bg-gray-700' : ''
      }`}
    />

  </div>

</div>



  {/* RIGHT */}
  <div className='flex items-center gap-3 flex-wrap'>

    {/* MOBILE MENU */}
    <div className='sm:hidden'>
      {
        isMenuOpen
          ? (
            <XIcon
              onClick={() => setIsMenuOpen(false)}
              className='size-6 cursor-pointer'
            />
          )
          : (
            <MessagesSquareIcon
              onClick={() => setIsMenuOpen(true)}
              className='size-6 cursor-pointer'
            />
          )
      }
    </div>

    {/* SAVE BUTTON */}
    <button
      onClick={saveProject}
      disabled={isSaving}
      className='bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1.5 flex items-center gap-2 rounded border border-gray-700 transition'
    >

      {
        isSaving
          ? <Loader2Icon className='animate-spin' size={16} />
          : <SaveIcon size={16} />
      }

      Save

    </button>

    {/* PREVIEW BUTTON */}
    <Link
      target="_blank"
      to={`/preview/${projectId}`}
      className='flex items-center gap-2 px-4 py-1.5 rounded border border-gray-700 hover:border-gray-500 transition'
    >

      <FullscreenIcon size={16} />

      Preview

    </Link>

    {/* DOWNLOAD BUTTON */}
    <button
      onClick={downloadCode}
      className='bg-blue-700 hover:bg-blue-600 text-white px-3.5 py-1.5 flex items-center gap-2 rounded transition'
    >

      <ArrowBigDownDashIcon size={16} />

      Download

    </button>

    {/* PUBLISH BUTTON */}
    <button
      onClick={togglePublish}
      className='bg-violet-700 hover:bg-violet-600 text-white px-3.5 py-1.5 flex items-center gap-2 rounded transition'
    >

      {
        project.isPublished
          ? <EyeOffIcon size={16} />
          : <EyeIcon size={16} />
      }

      {
        project.isPublished
          ? 'Unpublish'
          : 'Publish'
      }

    </button>

  </div>

</div>

      {/* BODY */}
      <div className='flex flex-1 overflow-hidden'>

        {/* SIDEBAR */}
        <Sidebar
          isMenuOpen={isMenuOpen}
          project={project}
          setProject={(p) => setProject(p)}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />

        {/* PREVIEW AREA */}
        <div className='flex-1 p-2 p1-0'>
             <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} />
        </div>

      </div>

    </div>

  ) : (

    <div className='flex items-center justify-center min-h-screen bg-gray-900'>

      <p className='text-2xl font-medium text-gray-200'>
        Unable to load project!
      </p>

    </div>

  )
}


export default Projects