"use client";
import DashboardTable from "@/components/dashboard/dashboradTable";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import {
  fetchJobsByUser,
 
} from "@/Ruduxtoolkit/jobSlice";
import { fetchApplicationsByJob } from "@/Ruduxtoolkit/applicationSlice";
import { fetchCandidates } from "@/Ruduxtoolkit/candidateSlice";


const AppliedJobsPage = () => {
  const dispatch = useAppDispatch();
  const [jobsWithCandidates, setJobsWithCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch jobs posted by the user
    const fetchData = async () => {
      try {
        // Step 1: Fetch all jobs posted by the user
        const jobsResponse = await dispatch(fetchJobsByUser()).unwrap();
        const jobs = jobsResponse as any[];

        // Step 2: Fetch applications and candidates for each job
        const jobsData = await Promise.all(
          jobs.map(async (job) => {
            // Fetch applications for the current job
            const applicationsResponse = await dispatch(fetchApplicationsByJob(job.$id)).unwrap();
            const jobApplications = applicationsResponse as any[];

            // Fetch candidate details for each application
            const candidates = await Promise.all(
              jobApplications.map(async (application) => {
                const candidateResponse = await dispatch(fetchCandidateById(application.candidateId)).unwrap();
                const candidate = candidateResponse as any;
                return {
                  ...application,
                  candidateName: candidate?.name || "Unknown",
                  candidateEmail: candidate?.email || "N/A",
                };
              })
            );

            return {
              ...job,
              candidates,
            };
          })
        );

        setJobsWithCandidates(jobsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Define table columns
  const columns = [
    { header: "Job Title", accessor: "title" },
    { header: "Company", accessor: "company" },
    { header: "Location", accessor: "location" },
    { header: "Candidate Name", accessor: "candidateName" },
    { header: "Candidate Email", accessor: "candidateEmail" },
    { header: "Application Status", accessor: "status" },
  ];

  return (
    <div className="w-full p-6">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-white mb-4">
        Jobs with Candidate Applications
      </h2>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-white">Loading...</p>
      )}

      {/* Display Table */}
      {!loading && jobsWithCandidates.length > 0 ? (
        jobsWithCandidates.map((job, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
            <DashboardTable
              caption={`Candidates who applied for "${job.title}"`}
              columns={columns}
              data={job.candidates}
            />
            {job.candidates.length === 0 && (
              <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                No candidates have applied to this job yet.
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          No jobs available or no candidates have applied yet.
        </div>
      )}
    </div>
  );
};

export default AppliedJobsPage;