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

  // Fetch jobs on mount
  useEffect(() => {
    dispatch(fetchJobsByUser());
  }, [dispatch]);

  // Fetch applicants for each job
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!userJobs || userJobs.length === 0) {
        setJobsWithApplicants([]);
        setLoading(false);
        return;
      }

      try {
        const jobsData = await Promise.all(
          userJobs.map(async (job: any) => {
            const applications = await dispatch(fetchApplicationsByJob(job.$id)).unwrap();

            const applicants = await Promise.all(
              applications.map(async (app: any) => {
                const candidates = await dispatch(fetchCandidatesByUserId(app.candidateId)).unwrap();
                const candidate = candidates?.[0];
                return {
                  applicantName: candidate?.fullName || "Unknown",
                  email: candidate?.email || "N/A",
                  status: app.status || "Pending",
                };
              })
            );

            return { ...job, applicants };
          })
        );

        setJobsWithApplicants(jobsData);
      } catch (error) {
        console.error(error);
        setJobsWithApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [userJobs, dispatch]);

  return (
    <div className="w-full space-y-8 text-white">
      {/* Top Cards */}
      <div className="flex flex-wrap gap-6">
        <Dashboardcard
          content="Jobs Posted"
          className="bg-blue-500"
          contentdata={userJobs.length}
        />
        <Dashboardcard
          content="Total Applications"
          className="bg-orange-400"
          contentdata={jobsWithApplicants.reduce(
            (total, job) => total + job.applicants.length,
            0
          )}
        />
        <Dashboardcard
          content="Selected Candidates"
          className="bg-green-600"
          contentdata={jobsWithApplicants.reduce(
            (total, job) =>
              total +
              job.applicants.filter((app: any) => app.status === "Accepted").length,
            0
          )}
        />
      </div>

      {/* Jobs Posted Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Your Posted Jobs</h2>

        {loading || jobsLoading ? (
          <p className="text-center text-white text-lg">Loading...</p>
        ) : jobsWithApplicants.length > 0 ? (
          jobsWithApplicants.map((job: any, index: number) => (
            <div
              key={index}
              className="bg-[#3a2c4a] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                <span className="text-sm text-gray-300">{job.industry || "General"}</span>
              </div>

              {/* Job description rendered as HTML */}


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
                <div className="mt-4 w-full bg-[#2e223f] p-4 rounded-lg text-center text-gray-400">
                  No applicants for this job yet.
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full bg-[#2e223f] p-6 rounded-lg shadow-md text-center text-gray-400">
            You haven't posted any jobs yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboardpage;
