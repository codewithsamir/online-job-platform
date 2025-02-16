import React from "react";
import Dashboardcard from "./dashboardcard";
import Dashboardtable from "./dashboradTable";
import { Dashboardchart } from "./dashboardchart";

const Dashboardpage = () => {
  // Example data: Replace this with actual data fetched from your backend or Redux state
  const appliedJobs:any[] = [
    // { jobTitle: "Software Engineer", company: "Tech Corp", status: "Pending" },
    // { jobTitle: "Product Manager", company: "Innovate Inc", status: "Accepted" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Cards */}
      <div className="top flex flex-wrap gap-6">
        <Dashboardcard content="Total Users" className="bg-orange-400" contentdata={100} />
        <Dashboardcard content="Total Job Reject" className="bg-red-800" contentdata={10} />
        <Dashboardcard content="Total Confirm Job" className="bg-green-600" contentdata={100} />
      </div>

      {/* Table Section */}
      <div className="table w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Applied Jobs</h2>
        {appliedJobs.length > 0 ? (
          <Dashboardtable
            caption="List of jobs you have applied to."
            columns={[
              { header: "Job Title", accessor: "jobTitle", },
              { header: "Company", accessor: "company" },
              { header: "Status", accessor: "status" },
            ]}
            data={appliedJobs}
          />
        ) : (
          <div className="w-full bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No jobs applied yet.
          </div>
        )}
      </div>

      {/* Charts Section */}
      {/* <div className="charts">
        <Dashboardchart />
      </div> */}
    </div>
  );
};

export default Dashboardpage;