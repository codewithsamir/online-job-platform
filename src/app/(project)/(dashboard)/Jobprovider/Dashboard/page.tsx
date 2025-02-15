"use client"
import Dashboardcard from "@/components/dashboard/dashboardcard";
import { Dashboardchart } from "@/components/dashboard/dashboardchart";
import Dashboardtable from "@/components/dashboard/dashboradTable";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import { fetchJobsByUser } from "@/Ruduxtoolkit/jobSlice";
import React, { useEffect } from "react";


const Dashboardpage = () => {
  // Example data: Replace this with 
  // actual data fetched from your backend or Redux state
const dispatch = useAppDispatch()
  const {userJobs}= useAppSelector((state)=>state.job)
 

  const userApplications:any[] = [];

  const selectedCandidates = 0

useEffect(()=>{
  dispatch(fetchJobsByUser())
},[])


  return (
    <div className="w-full space-y-6 text-white">
      {/* Top Cards */}
      <div className="top flex flex-wrap gap-6">
        <Dashboardcard
          content="Jobs Posted"
          className="bg-blue-500"
          contentdata={userJobs.length}
        />
        <Dashboardcard
          content="Total Applications"
          className="bg-orange-400"
          contentdata={userApplications.length}
        />
        <Dashboardcard
          content="Selected Candidates"
          className="bg-green-600"
          contentdata={selectedCandidates}
        />
      </div>

      {/* Table Section */}
      <div className="table w-full">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Job Applications</h2>
        {userApplications.length > 0 ? (
          <Dashboardtable
            caption="List of users who applied to your jobs."
            columns={[
              { header: "Applicant Name", accessor: "applicantName" },
              { header: "Job Title", accessor: "jobTitle" },
              { header: "Status", accessor: "status" },
            ]}
            data={userApplications}
          />
        ) : (
          <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No recent job applications.
          </div>
        )}
      </div>

      {/* Jobs Posted Section */}
      <div className="table w-full">
        <h2 className="text-xl font-semibold text-white mb-4">Your Posted Jobs</h2>
        {userJobs.length > 0 ? (
          <Dashboardtable
            caption="List of jobs you have posted."
            columns={[
              { header: "Job Title", accessor: "title" },
              { header: "Company", accessor: "companyName" },
              { header: "Job Type", accessor: "jobType" },
            ]}
            data={userJobs}
          />
        ) : (
          <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No jobs posted yet.
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="charts">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Trends</h2>
        <Dashboardchart />
      </div>
    </div>
  );
};

export default Dashboardpage;