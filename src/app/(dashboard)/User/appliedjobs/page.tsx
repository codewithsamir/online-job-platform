"use client"
import Dashboardtable from '@/components/dashboard/dashboradTable'
import { fetchApplicationsByCandidate } from '@/Ruduxtoolkit/applicationSlice'
import { useAppDispatch, useAppSelector } from '@/Ruduxtoolkit/hook'
import { fetchJobById } from '@/Ruduxtoolkit/jobSlice'
import React, { useEffect, useState } from 'react'

const page = () => {
    const dispatch = useAppDispatch();
    const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Fetch applied jobs for the current user
      const fetchData = async () => {
        try {
          // Dispatch the action to fetch applications by user
          const response = await dispatch(fetchApplicationsByCandidate()).unwrap();
          const applications = response as any[];
  
          // Transform the data if necessary (e.g., map fields to match your table structure)
          const data = await Promise.all(
           applications.map(async (application) => {
           const job = await dispatch(fetchJobById(application.jobId)).unwrap();
           return{
            ...application,
            title:job.title,
            company:job.companyName,
           }
          })
  
        )
  // console.log("it",data)
          setAppliedJobs(data); // Update state with fetched data
        } catch (error) {
          console.error("Failed to fetch applied jobs:", error);
        } finally {
          setLoading(false); // Ensure loading state is reset
        }
      };
  
      fetchData();
    }, [dispatch]);
  return (
    <div>
        <h2 className='text-3xl font-semibold text-center capitalize text-white my-4'>Applied jobs</h2>

        <div className="jobshow bg-[#af8dff3c] p-2 rounded-xl text-white my-4  text-xl">
             {/* Table Section */}
                  <div className="table w-full">
                    
                    {appliedJobs.length > 0 ? (
                      <Dashboardtable
                        caption="List of jobs you have applied to."
                        columns={[
                          { header: "Job Title", accessor: "title", },
                          { header: "Company", accessor: "company" },
                          { header: "Status", accessor: "status" },
                          { header: "jobdetail", accessor: "visit" },
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

export default page