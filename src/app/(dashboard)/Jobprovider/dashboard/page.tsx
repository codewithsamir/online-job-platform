"use client";
import Dashboardcard from "@/components/dashboard/dashboardcard";
import Dashboardtable from "@/components/dashboard/dashboradTable";
import { fetchApplicationsByJob } from "@/Ruduxtoolkit/applicationSlice";
import { fetchCandidatesByUserId } from "@/Ruduxtoolkit/candidateSlice";
import { fetchJobsByUser } from "@/Ruduxtoolkit/jobSlice";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import React, { useEffect, useState } from "react";
  
const Dashboardpage = () => {
  const dispatch = useAppDispatch();
  const { userJobs, loading: jobsLoading } = useAppSelector((state) => state.job);
  const [jobsWithApplicants, setJobsWithApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch jobs posted by the user
    dispatch(fetchJobsByUser()).then(async () => {
      if (userJobs.length > 0) {
        // Fetch applications for each job and get candidate details
        const jobsData = await Promise.all(
          userJobs.map(async (job) => {
            try {
              // Fetch applications for the specific job ID
              const applications = await dispatch(fetchApplicationsByJob(job.$id)).unwrap();

              // Fetch candidate details for each application
              const applicants = await Promise.all(
                applications.map(async (app:any) => {
                  const candidate = await dispatch(fetchCandidatesByUserId(app.candidateId)).unwrap();
                  // console.log(candidate)
                  return {
                    applicantName: candidate?.documents[0].fullName || "Unknown",
                    status: app.status || "Pending",
                    email: candidate?.documents[0].email || "N/A", // Add additional candidate details if needed
                  };
                })
              );

              return {
                ...job,
                applicants,
              };
            } catch (error) {
              console.error(`Failed to fetch data for job ${job.$id}:`, error);
              return {
                ...job,
                applicants: [], // Return an empty array if fetching fails
              };
            }
          })
        );
        setJobsWithApplicants(jobsData);
      }
      setLoading(false);
    });
  }, [dispatch, userJobs]);

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
          contentdata={jobsWithApplicants.reduce((total, job) => total + job.applicants.length, 0)}
        />
        <Dashboardcard
          content="Selected Candidates"
          className="bg-green-600"
          contentdata={jobsWithApplicants.reduce(
            (total, job) => total + job.applicants.filter((app) => app.status === "Accepted").length,
            0
          )}
        />
      </div>

      {/* Jobs Posted Section */}
      <div className="table w-full">
        <h2 className="text-xl font-semibold text-white mb-4">Your Posted Jobs</h2>
        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : jobsWithApplicants.length > 0 ? (
          jobsWithApplicants.map((job, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
              <Dashboardtable
                caption={`Applicants for "${job.title}"`}
                columns={[
                  { header: "Applicant Name", accessor: "applicantName" },
                  { header: "Email", accessor: "email" },
                  { header: "Status", accessor: "status" },
                ]}
                data={job.applicants}
              />
              {job.applicants.length === 0 && (
                <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                  No applicants for this job yet.
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No jobs posted yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboardpage;