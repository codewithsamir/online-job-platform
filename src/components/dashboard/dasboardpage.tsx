"use client";
import React, { useEffect, useState } from "react";
import Dashboardcard from "./dashboardcard";
import Dashboardtable from "./dashboradTable";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import { fetchApplicationsByCandidate } from "@/Ruduxtoolkit/applicationSlice";
import { fetchJobById } from "@/Ruduxtoolkit/jobSlice";

const Dashboardpage = () => {
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

  // Get only the most recent job
  const recentJob = appliedJobs.length > 0 ? [appliedJobs[appliedJobs.length - 1]] : [];
console.log(recentJob);
  // Total number of applicants
  const totalApplicants = appliedJobs.length;

  // Count of selected candidates
  const totalSelectedCandidates = appliedJobs.filter((job:any) => job.status === "Accepted").length;

  return (
    <div className="w-full space-y-6">
      {/* Top Cards */}
      <div className="top flex flex-wrap gap-6">
        <Dashboardcard
          content="Total Applications"
          className="bg-blue-500"
          contentdata={totalApplicants}
        />
        <Dashboardcard
          content="Total Selected Candidates"
          className="bg-green-600"
          contentdata={totalSelectedCandidates}
        />
      </div>

      {/* Table Section */}
      <div className="table w-full">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Job Applied</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : recentJob.length > 0 ? (
          <Dashboardtable
            caption="Most recent job you have applied to."
            columns={[
              { header: "Job Title", accessor: "title" },
              { header: "Company", accessor: "company" },
              { header: "Status", accessor: "status" },
            ]}
            data={recentJob}
            isuser={true}
          />
        ) : (
          <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No jobs applied yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboardpage;