"use client"
import DashboardTable from '@/components/dashboard/dashboradTable';
import React from 'react';
import { useAppSelector } from '@/Ruduxtoolkit/hook';

const AppliedJobsPage = () => {
  // Fetch applied jobs data from Redux state
  // const { jobs, loading } = useAppSelector((state) => state.job);
  const loading = false;

  // Define table columns
  const columns = [
    { header: "Job Title", accessor: "title" },
    { header: "Company", accessor: "company" },
    { header: "Location", accessor: "location" },
    { header: "Status", accessor: "status" },
    { header: "Applied On", accessor: "appliedOn" },
  ];

  return (
    <div className="w-full p-6">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-white mb-4">Applied Jobs</h2>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-white">Loading...</p>
      )}

      {/* Display Table */}
      {loading  ? (
        // <DashboardTable
        //   caption="List of jobs you have applied to."
        //   columns={columns}
        //   data={appliedJobs}
        // />
        <p>No jobs applied yet.</p> // Replace with DashboardTable component when available
      ) : (
        <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          No jobs applied yet.
        </div>
      )}
    </div>
  );
};

export default AppliedJobsPage;