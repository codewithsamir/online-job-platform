import Image from 'next/image';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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


  const jobDescription = {
    jobCategory: data?.jobCategory || "IT & Telecommunication", 
    jobLevel: data?.jobLevel || "Senior Level", 
    noOfVacancy: data?.noOfVacancy || 1, 
    employmentType: data?.jobType || "Full Time", 
    jobLocation: data?.location || "Kathmandu", 
    offeredSalary: data?.salaryRange || "Negotiable", 
    applyBefore: data?.applicationDeadline || "Oct. 12, 2024", 
    jobSpecification: {
      educationLevel: data?.specification?.educationLevel || "Under Graduate (Bachelor)",
      experienceRequired: data?.specification?.experienceRequired || "8+ years",
      professionalSkills: data?.specification?.professionalSkills || [], 
    },
    otherSpecifications: data?.otherSpecifications || {},
  };

  return (
    <div className={`jobdescription p-10 ${classNames}`}>
    

    <div className={`jobdescription p-10 ${classNames}`}>
      {/* Job Image */}
      <div className="image w-full h-[300px]">
        <Image
          src={data?.imagelink || "/demo.jpg"} // Use image link from data or fallback
          alt="job description"
          width={100}
          height={300}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Company Description */}
      <div className="companydescription py-3">
        <p>
          {data?.description ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque laborum quod neque unde quibusdam, reiciendis eius dicta recusandae fugiat dolore."}
        </p>
      </div>

      {/* Job Title and Metadata */}
      <div className="job-title sm:flex justify-between">
        <h1 className="text-3xl font-bold">{data?.title || "Job Title"}</h1>
        <h2>
          View 234 | Apply before: {data?.applicationDeadline || "two weeks from now"}
        </h2>
      </div>

      {/* Basic Job Description Table */}
      <Table className="w-full sm:w-[600px] my-4">
        <TableHeader>
          <TableRow>
            <TableHead className="text-3xl p-2">Basic Job Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-xl">
              <strong>Job Category: </strong>{data?.jobCategory || "IT & Telecommunication"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-xl">
              <strong>Job Level: </strong>{data?.jobLevel || "Senior Level"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-xl">
              <strong>No. of Vacancies: </strong>{data?.noOfVacancy || 1}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-xl">
              <strong>Employment Type: </strong>{data?.jobType || "Full Time"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-xl">
              <strong>Location: </strong>{data?.location || "Kathmandu"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-xl">
              <strong>Salary Range: </strong>{data?.salaryRange || "Negotiable"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-xl">
              <strong>Apply Before: </strong>{data?.applicationDeadline || "Oct. 12, 2024"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Job Specifications */}
      <div className="specifications">
        <h2 className="font-bold text-xl">Job Specifications</h2>
        <ul>
          <li><strong>Education: </strong>{data?.specification?.educationLevel || "Under Graduate (Bachelor)"}</li>
          <li><strong>Experience Required: </strong>{data?.specification?.experienceRequired || "8+ years"}</li>
          <li><strong>Professional Skills: </strong>{data?.specification?.professionalSkills?.join(", ") || "N/A"}</li>
        </ul>
      </div>

     
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