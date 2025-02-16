"use client"
import Jobdescription from '@/components/Landingpage/Jobdescription'
import { useAppDispatch, useAppSelector } from '@/Ruduxtoolkit/hook'
import { fetchJobById } from '@/Ruduxtoolkit/jobSlice'
import React, { use, useEffect } from 'react'

const page = ({params}:any) => {
  const param:any = use(params)
    
      const dispatch = useAppDispatch()
      const {selectedJob} = useAppSelector((state)=>state.job)
        // console.log(selectedJob)
      
        useEffect(()=>{
          const getparams = async ()=>{
            const params =  decodeURIComponent(param.jobid).split("_")[1]
            // console.log(param)
            
           await dispatch(fetchJobById(params))
          }
          getparams()
        },[])
        console.log(selectedJob)
  return (
    <div>
        <Jobdescription data={selectedJob} classNames=" w-full p-2 md:w-[70%] mx-auto"  />
    </div>
  )
}

export default page