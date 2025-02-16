"use client"
import Dashboardtable from '@/components/dashboard/dashboradTable'
import { useAppDispatch, useAppSelector } from '@/Ruduxtoolkit/hook'
import React from 'react'

const page = () => {
  const {applicationsByCandidate} = useAppSelector(state=>state.application)

  return (
    <div>
        <h2 className='text-3xl font-semibold text-center capitalize text-white my-4'>Applied jobs</h2>

        <div className="jobshow bg-[#af8dff3c] p-2 rounded-xl text-white my-4 text-center text-xl">
             {/* Table Section */}
                  <div className="table w-full">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Applied Jobs</h2>
                    {applicationsByCandidate.length > 0 ? (
                      <Dashboardtable
                        caption="List of jobs you have applied to."
                        columns={[
                          { header: "Job Title", accessor: "jobTitle", },
                          { header: "Company", accessor: "company" },
                          { header: "Status", accessor: "status" },
                        ]}
                        data={applicationsByCandidate}
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