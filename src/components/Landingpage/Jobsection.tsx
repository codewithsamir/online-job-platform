"use client"
import React, { useEffect } from "react";
import Jobcard from "./Jobcard";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import { fetchJobs } from "@/Ruduxtoolkit/jobSlice";

const Jobsection = () => {
  const {jobs} = useAppSelector((state) => state.job)
   const dispatch = useAppDispatch()
   useEffect(() => {
     dispatch(fetchJobs())
   }, [dispatch])
   // console.log(jobs)

  return (
    <section className="bg-[#2E2835] w-full h-auto px-2 py-5  sm:p-10">
      <h1 className="text-xl sm:text-3xl uppercase font-semibold text-center text-white p-10">
        Recent job
      </h1>
      <div className="job-container  flex flex-wrap justify-center gap-5">
        {jobs.map((data)=>   <Link href={`/jobs/${data.title}_${data.$id}`} key={data.jobtitle}><Jobcard  data={data} /></Link>)}
     
      </div>
    </section>
  );
};

export default Jobsection;
