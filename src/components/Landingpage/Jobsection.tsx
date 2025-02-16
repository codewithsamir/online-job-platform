"use client";

import React, { useEffect } from "react";
import Jobcard from "./Jobcard";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import { fetchJobs } from "@/Ruduxtoolkit/jobSlice";
import { Skeleton } from "../ui/skeleton";

const Jobsection = () => {
  const { jobs, loading } = useAppSelector((state) => state.job);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <section className="bg-[#2E2835] w-full h-auto px-2 py-5 sm:p-10">
      <h1 className="text-xl sm:text-3xl uppercase font-semibold text-center text-white p-10">
        Recent Jobs
      </h1>
      <div
        className={`job-container flex flex-wrap justify-center gap-5 `}
      >
        {loading || !jobs.length ? (
          // Show four skeleton loaders in a centered grid
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3 w-[300px]">
              {/* Adjusted Skeleton Colors */}
              <Skeleton className="h-[200px] w-full rounded-xl bg-gray-700 animate-pulse" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-600 animate-pulse" />
                <Skeleton className="h-4 w-[80%] bg-gray-600 animate-pulse" />
              </div>
            </div>
          ))
        ) : (
          // Render job cards if jobs are available
          jobs.map((data) => (
            <Link href={`/jobs/${data.title}_${data.$id}`} key={data.$id}>
              <Jobcard data={data} />
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default Jobsection;