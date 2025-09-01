"use client"
import Dashboardtable from '@/components/dashboard/dashboradTable'
import { fetchApplicationsByCandidate } from '@/Ruduxtoolkit/applicationSlice'
import { useAppDispatch } from '@/Ruduxtoolkit/hook'
import { fetchJobById } from '@/Ruduxtoolkit/jobSlice'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const dispatch = useAppDispatch();
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchApplicationsByCandidate()).unwrap();
        const applications = response as any[];

        const data = await Promise.all(
          applications.map(async (application) => {
            const job = await dispatch(fetchJobById(application.jobId)).unwrap();
            return {
              ...application,
              title: job.title,
              company: job.companyName,
            };
          })
        );

        setAppliedJobs(data);
      } catch (error) {
        console.error("Failed to fetch applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-3xl font-semibold text-center capitalize text-white my-4">
        Applied jobs
      </h2>

      <div className="jobshow bg-[#af8dff3c] p-2 rounded-xl text-white my-4 text-xl">
        <div className="table w-full">
          {loading ? (
            <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
              Loading applied jobs...
            </div>
          ) : appliedJobs.length > 0 ? (
            <Dashboardtable
              caption="List of jobs you have applied to."
              columns={[
                { header: "Job Title", accessor: "title" },
                { header: "Company", accessor: "company" },
                { header: "Status", accessor: "status" },
                { header: "Job Detail", accessor: "visit" },
              ]}
              data={appliedJobs}
              isuser={true}
            />
          ) : (
            <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              No jobs applied yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
