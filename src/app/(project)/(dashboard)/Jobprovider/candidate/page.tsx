"use client";
import DashboardTable from "@/components/dashboard/dashboradTable";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import { fetchApplicationsByJob } from "@/Ruduxtoolkit/applicationSlice";
import { fetchCandidatesByUserId } from "@/Ruduxtoolkit/candidateSlice";
import { fetchJobsByUser } from "@/Ruduxtoolkit/jobSlice";



const AppliedJobsPage = () => {
  const dispatch = useAppDispatch();
  const [jobsWithCandidates, setJobsWithCandidates,] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const {isupdate} = useAppSelector((state) => state.application);

  useEffect(() => {
    // Fetch jobs posted by the user
    const fetchData = async () => {
      try {
        // Step 1: Fetch all jobs posted by the user
        const jobsResponse = await dispatch(fetchJobsByUser()).unwrap();
        const jobs = jobsResponse as any[];

        // Step 2: Fetch applications and candidates for each job
        const jobsData = await Promise.all(
          jobs.map(async (job,index) => {
            // Fetch applications for the current job
            const applicationsResponse = await dispatch(fetchApplicationsByJob(job.$id)).unwrap();
            const jobApplications = applicationsResponse as any[];
            
            // Fetch candidate details for each application
            const candidates = await Promise.all(
              jobApplications.map(async (application) => {
                const candidateResponse = await dispatch(fetchCandidatesByUserId(application.candidateId)).unwrap();
                const candidate = candidateResponse as any;
                
                return {
                  ...application,
                  candidateName: candidate?.documents[0].fullName || "Unknown",
                  candidateEmail: candidate?.documents[0].email || "N/A",
                };
              })
            );

            return {
              ...job,
              ...candidates[0],
              totalcandidate :candidates.length
            };
          })
        );

        setJobsWithCandidates(jobsData);
        // console.log(jobsData)
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch,isupdate]);

  // Define table columns
  const columns = [
    { header: "Job Title", accessor: "title",className:"text-white" },
    { header: "Company", accessor: "companyName",className:"text-white"  },
    { header: "Location", accessor: "location",className:"text-white"  },
    { header: "Candidate Name", accessor: "candidateName" ,className:"text-white" },
    { header: "Candidate Email", accessor: "candidateEmail",className:"text-white"  },
    { header: "Resume", accessor: "resumeUrl",className:"text-blue-500 cursor-pointer"  },
    { header: "Application Status", accessor: "status",className:"text-white"  },
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
              data={job.totalcandidate === 0 ? [] : job}
              action={true}
              
            />
            {job.totalcandidate === 0 && (
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