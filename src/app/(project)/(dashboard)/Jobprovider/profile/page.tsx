"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useAppSelector } from "@/Ruduxtoolkit/hook";

const MyInformation = () => {
  // Fetch companies data from Redux state
  const { companies, loading } = useAppSelector((state) => state.company);

  // Extract the first company document (if available)
  const company = companies?.documents?.[0];

  return (
    <div>
      {/* Title */}
      <h2 className="text-3xl font-semibold text-center capitalize text-white my-4">
        My Company Information
      </h2>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-white">Loading...</p>
      )}

      {/* Display Company Information */}
      {!loading && company ? (
        <div className="jobshow mx-auto my-4 w-[70%] h-[500px] bg-[#af8dff3c] px-10 py-4 rounded-xl text-white text-center text-xl flex gap-6 justify-center">
          {/* Company Logo */}
          <div className="image w-[150px] h-[150px] bg-[#d9d9d945] rounded-md flex items-center justify-center">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt="Company Logo"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span>No Logo</span>
            )}
          </div>

          {/* Company Information */}
          <div className="info rounded-md bg-[#d9d9d945] w-[400px] h-full text-left p-6 flex justify-between flex-col">
            <div className="fullinfo space-y-2">
              <p className="">
                Name: <span className="font-semibold">{company.name}</span>
              </p>
              <p className="">
                Email: <span className="font-semibold">{company.email}</span>
              </p>
              <p className="">
                Industry: <span className="font-semibold">{company.industry}</span>
              </p>
              <p className="">
                Description: <span className="font-semibold">{company.description}</span>
              </p>
              <p className="">
                Website:{" "}
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-300 hover:underline"
                >
                  {company.website}
                </a>
              </p>
              <p className="">
                Created By: <span className="font-semibold">{company.createdBy}</span>
              </p>
              <p className="">
                Created At: <span className="font-semibold">{new Date(company.$createdAt).toLocaleDateString()}</span>
              </p>
            </div>

            {/* Update Button */}
            {/* <div className="button mt-4">
              <Button
                variant="secondary"
                className="bg-[#FF0B7E] hover:bg-pink-600 text-white w-full"
              >
                Update
              </Button>
            </div> */}
          </div>
        </div>
      ) : (
        <p className="text-center text-white">No company information found.</p>
      )}
    </div>
  );
};

export default MyInformation;