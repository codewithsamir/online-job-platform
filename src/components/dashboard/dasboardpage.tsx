import React from "react";
import Dashboardcard from "./dashboardcard";
import Dashboardtable from "./dashboradTable";

const Dashboardpage = () => {
  // Example data: Replace this with actual data fetched from your backend or Redux state
  const appliedJobs: any[] = [
    { jobTitle: "Software Engineer", company: "Tech Corp", status: "Pending" },
    { jobTitle: "Product Manager", company: "Innovate Inc", status: "Accepted" },
    { jobTitle: "UI/UX Designer", company: "DesignHub", status: "Rejected" },
  ];

  // Get only the most recent job
  const recentJob = appliedJobs.length > 0 ? [appliedJobs[appliedJobs.length - 1]] : [];

  // Total number of applicants
  const totalApplicants = appliedJobs.length;

  // Count of selected candidates
  const totalSelectedCandidates = appliedJobs.filter(job => job.status === "Accepted").length;

  return (
    <div className="w-full space-y-6">
      {/* Top Cards */}
      <div className="top flex flex-wrap gap-6">
        <Dashboardcard content="Total Applicants" className="bg-blue-500" contentdata={totalApplicants} />
        <Dashboardcard content="Total Selected Candidates" className="bg-green-600" contentdata={totalSelectedCandidates} />
      </div>

      {/* Table Section */}
      <div className="table w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Job Applied</h2>
        {recentJob.length > 0 ? (
          <Dashboardtable
            caption="Most recent job you have applied to."
            columns={[
              { header: "Job Title", accessor: "jobTitle" },
              { header: "Company", accessor: "company" },
              { header: "Status", accessor: "status" },
            ]}
            data={recentJob}
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
