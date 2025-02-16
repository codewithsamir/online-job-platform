import Image from 'next/image';
import React, { useState } from 'react';
import parse from 'html-react-parser'; // Import HTML parser
import { Button } from '../ui/button';
import ApplicationForm from '../dashboard/applicationForm'; // Import the ApplicationForm component
import { useAppSelector } from '@/Ruduxtoolkit/hook';
import { toast } from "sonner"; // For toast notifications

const Jobdescription = ({ data, classNames }: any) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility

  // Handle the "Apply" button click
  const handleApplyClick = () => {
    if (!user?.$id) {
      toast.error("Please log in or authenticate to apply for this job.");
      return;
    }
    setIsFormOpen(true);
  };

  return (
    <div className={`jobdescription p-10 ${classNames}`}>
      {/* Job Image */}
      <div className="image w-full h-[300px]">
        <Image
          src={data?.companyProfile?.logoUrl || "/demo.jpg"} // Use image link from data or fallback
          alt="job description"
          width={100}
          height={300}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Job Title and Metadata */}
      <div className="job-title sm:flex justify-between py-3">
        <h1 className="text-3xl font-bold">{data?.title || "Job Title"}</h1>
        <h2>
          View 234 | Apply before: {data?.applicationDeadline || "two weeks from now"}
        </h2>
      </div>

      {/* Job Category and Total Vacancy */}
      <div className="text-xl font-semibold">
        <p><strong>Category:</strong> {data?.category}</p>
        <p><strong>Total Vacancy:</strong> {data?.totalvacancy}</p>
      </div>

      {/* Job Description with HTML Parsing */}
      <div className="job-description mt-4">
        <h2 className="text-2xl font-bold">Job Description</h2>
        <div className="mt-2 text-lg">{parse(data?.description || "")}</div>
      </div>

      {/* Apply Button */}
      <div className="py-4">
        <Button
          className="border-none sm:w-[200px] bg-[#D83F87] hover:bg-[#f54698]"
          onClick={handleApplyClick} // Open the form on click
        >
          Apply
        </Button>
      </div>

      {/* Application Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#4d125c] p-6 rounded-lg shadow-lg w-[400px] relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-white text-3xl hover:text-gray-300"
              onClick={() => setIsFormOpen(false)} // Close the modal
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Apply for this Job</h2>
            <ApplicationForm
              userid={user?.$id}
              jobId={data?.$id} // Pass the job ID to the form
              onClose={() => setIsFormOpen(false)} // Close the modal
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobdescription;
