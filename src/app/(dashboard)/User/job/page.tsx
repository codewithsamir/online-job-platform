"use client"
import Jobcard from '@/components/Landingpage/Jobcard'
import { useAppDispatch, useAppSelector } from '@/Ruduxtoolkit/hook';
import { fetchJobs } from '@/Ruduxtoolkit/jobSlice';
import Link from 'next/link';
import React, { useEffect } from 'react'

const page = () => {
  const {jobs} = useAppSelector((state) => state.job)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])
  // console.log(jobs)
  return (
    <div className='p-4'>
        <h2 className='text-3xl py-4 font-semibold text-center text-white'>Recommended jobs</h2>
        <div className="container">
        <div className="job-container  flex flex-wrap justify-center gap-5">
        {jobs.map((data,index)=>   <Link href={`/User/job/${data.title}_${data.$id}`} key={index + 1}><Jobcard  data={data}  /></Link>)}
     
      </div>
        </div>
    </div>
  )
}

export default page