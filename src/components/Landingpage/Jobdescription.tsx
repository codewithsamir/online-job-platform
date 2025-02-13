import Image from 'next/image'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '../ui/button';
  

const Jobdescription = ({data,classNames}:any) => {

    const jobDescription = {
        jobCategory: "IT & Telecommunication",
        jobLevel: "Senior Level",
        noOfVacancy: 1,
        employmentType: "Full Time",
        jobLocation: "Kathmandu",
        offeredSalary: "Negotiable",
        applyBefore: "Oct. 12, 2024",
        jobspcification:{
            educationLevel: "Under Graduate (Bachelor)",
        experienceRequired: "8+ years",
        professionalSkills: [
          "Conflict Management",
          "Team Management",
          "Monitoring",
          "Result Oriented",
          "Technical"
        ],
    },
        otherSpecifications: {
          degree: "Bachelor's in Engineering, Electronic & Communication Engineering or a related field",
          projectManagement: "Certification in Project Management (added advantage)",
          industryExperience: "8+ years in relevant telecommunication industry",
          teamManagement: "Managing a team of 30+ technicians and 100+ casual workers",
          skills: [
            "Fiber Optic Maintenance of UG & ADSS",
            "Key Knowledge and interpretation of designs",
            "Practical knowledge of MS Word, Excel, Access, and PowerPoint",
            "Activity and Resource Planning",
            "Time Management",
            "Cost estimation and developing the budget",
            "Customer Satisfaction",
            "Project Risk Analysis and Management",
            "Progress Monitoring",
            "Conflict Management",
            "Results Focused"
          ]
        }
      };
      
    //   console.log(jobDescription);
    // const data = Object.entries(jobDescription)
    // console.log(data)


    
  
  return (
   <div className={`jobdescription p-10 ${classNames} `}>
    <div className="image w-full h-[300px]">
        <Image src={"/demo.jpg"} alt='job decription' width={100} height={300} className='w-full h-full object-cover object-center' />
    </div>
    <div className="companydescription py-3">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque laborum quod neque unde quibusdam, reiciendis eius dicta recusandae fugiat dolore.</p>
    </div>
    <div className="job-title sm:flex justify-between ">
        <h1 className="text-3xl font-bold">{data}</h1>
        <h2>view 234 |  apply before : two weeks form now</h2>
    </div>

    <Table className='w-full sm:w-[600px] my-4'>
  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
  <TableHeader>
    <TableRow>
      <TableHead className='text-3xl p-2 '>Basic job Description</TableHead>
      {/* <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead> */}
    </TableRow>
  </TableHeader>
  <TableBody>
    {Object.entries(jobDescription).map((data)=>{
        const [key,value]  = data
    if(typeof value === 'string' ){
        return   <TableRow key={key}>
        <TableCell className="font-semibold text-xl">{key} </TableCell>
        <TableCell className='text-xl' >:</TableCell>
        <TableCell className='text-xl'>{value}</TableCell>
        
      </TableRow>
    }
      
    })}
  

  </TableBody>
</Table>


    <Table className='w-full sm:w-[600px] my-4'>
  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
  <TableHeader>
    <TableRow>
      <TableHead className='text-3xl p-2 w-full'> job specification</TableHead>
    
    </TableRow>
  </TableHeader>
  <TableBody>
    {Object.entries(jobDescription.jobspcification).map((data)=>{
        const [key,value]  = data
    
        return   <TableRow key={key}>
        <TableCell className="font-semibold text-xl">{key} </TableCell>
        <TableCell className='text-xl' >:</TableCell>
        <TableCell className='text-xl'>{typeof value === 'string' ? value:value.join(",")}</TableCell>
        
      </TableRow>
    
      
    })}
  

  </TableBody>
</Table>



{/* list  */}
<h2 className='text-3xl py-3 uppercase'>other Specifiaction</h2>
<ul className='list-inside list-disc text-xl leading-10'>
    {Object.entries(jobDescription.otherSpecifications).map((data)=>{
            const [key,value]  = data;
            if(typeof value === 'string'){
                return   <li key={key}>{value}</li>

            }else {
               return   <>
                {value.map((data)=>{
                
                return   <li key={data}>{data}</li>}
                )}
                 
               </>
              }
    })}
  
</ul>


<div className="py-4">
<Button className='border-none sm:w-[200px]   bg-[#D83F87] hover:bg-[#f54698]'>Apply</Button>
</div>

   </div>
  )
}

export default Jobdescription