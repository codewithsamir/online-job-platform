import Jobdescription from '@/components/Landingpage/Jobdescription'
import React, { useEffect, useState } from 'react'

const page = ({params}:any) => {
    
    const [title,settitle] =useState("")
    useEffect(()=>{
      const getparams = async ()=>{
        settitle(decodeURIComponent(params.jobid))
      }
      getparams()
    },[])
  return (
    <div>
        <Jobdescription data={title}  classNames="text-white" />
    </div>
  )
}

export default page