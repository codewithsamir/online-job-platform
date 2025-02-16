"use client"
import { Button } from '@/components/ui/button';
import React from 'react';
import { useAppSelector } from '@/Ruduxtoolkit/hook';

const MyInformation = () => {
  // Fetch candidates data from Redux state
  const { candidates, loading } = useAppSelector((state) => state.candidate);

  // Extract the first candidate document (if available)
  const candidate = candidates?.documents?.[0];

  return (
    <div>
      {/* Title */}
      <h2 className='text-3xl font-semibold text-center capitalize text-white my-4'>
        My Information
      </h2>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-white">Loading...</p>
      )}

      {/* Display Candidate Information */}
      {!loading && candidate ? (
        <div className="jobshow mx-auto my-4 w-[70%] h-[500px] bg-[#af8dff3c] px-10 py-4 rounded-xl text-white text-center text-xl flex gap-6 justify-center">
          {/* Profile Picture */}
          <div className="image w-[150px] h-[150px] bg-[#d9d9d945] rounded-md flex items-center justify-center">
            {candidate.profileUrl ? (
              <img
                src={candidate.profileUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span>No Image</span>
            )}
          </div>

          {/* Candidate Information */}
          <div className="info rounded-md bg-[#d9d9d945] w-[400px] h-full text-left p-6 flex justify-between flex-col">
            <div className="fullinfo space-y-2">
              <p className='capitalize'>
                Name: <span className='font-semibold'>{candidate.fullName}</span>
              </p>
              <p className='capitalize'>
                Email: <span className='font-semibold'>{candidate.email}</span>
              </p>
              <p className='capitalize'>
                Phone: <span className='font-semibold'>{candidate.phone}</span>
              </p>
              <p className='capitalize'>
                Address: <span className='font-semibold'>{candidate.address}</span>
              </p>
              <p className='capitalize'>
                Gender: <span className='font-semibold'>{candidate.gender}</span>
              </p>
              <p className='capitalize'>
                Date of Birth: <span className='font-semibold'>{candidate.dateofbirth}</span>
              </p>
              <p className='capitalize'>
                Education: <span className='font-semibold'>{candidate.education}</span>
              </p>
              <p className='capitalize'>
                Experience: <span className='font-semibold'>{candidate.experience}</span>
              </p>
              <p className='capitalize'>
                Skills: <span className='font-semibold'>{candidate.skills || "Not provided"}</span>
              </p>
            </div>

            {/* Update Button */}
            {/* <div className="button mt-4">
              <Button
                variant="secondary"
                className='bg-[#FF0B7E] hover:bg-pink-600 text-white w-full'
              >
                Update
              </Button>
            </div> */}
          </div>
        </div>
      ) : (
        <p className="text-center text-white">No candidate information found.</p>
      )}
    </div>
  );
};

export default MyInformation;