import { Loader2Icon } from 'lucide-react'
import { useEffect } from 'react'

const Loading = () => {

    useEffect(()=> {
        setTimeout(()=>{
            window.location.href = '/'
        },6000)
    })

  return (
    <div className='min-h-screen flex flex-col  justify-center items-center'>
        <div>
            <Loader2Icon className='size-7 animate-spin text-indigo-200'/>
        </div>
    </div>
  )
}

export default Loading