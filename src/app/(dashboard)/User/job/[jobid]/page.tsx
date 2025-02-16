"use client"
import Jobdescription from '@/components/Landingpage/Jobdescription'
import { useAppDispatch, useAppSelector } from '@/Ruduxtoolkit/hook'
import { fetchJobById } from '@/Ruduxtoolkit/jobSlice'
import React, { use, useEffect, useState } from 'react'

const page = ({params}:any) => {
  const resolvedParams:any = use(params);
  const dispatch = useAppDispatch()
  const {selectedJob} = useAppSelector((state)=>state.job)
    // console.log(selectedJob)
  
    useEffect(()=>{
      const getparams = async ()=>{
        const param =  decodeURIComponent(resolvedParams.jobid).split("_")[1]
        // console.log(param)
        
       await dispatch(fetchJobById(param))
      }
      getparams()
    },[])
    console.log(selectedJob)
  return (
    <div>
        <Jobdescription data={selectedJob}  classNames="text-white" />
    </div>
  )
}

export default page