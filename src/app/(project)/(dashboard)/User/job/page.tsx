import Jobcard from '@/components/Landingpage/Jobcard'
import Link from 'next/link';
import React from 'react'

const page = () => {
    const cardinfo = [
        {
          imagelink:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG9ubGluZSUyMGpvYnxlbnwwfHwwfHx8MA%3D%3D",
            jobtime:"full time",
          jobtitle: "Software Developer",
          jobdes:
            "Develop and maintain software applications, focusing on optimizing performance and user experience.",
        },
        {
          imagelink:
            "https://images.unsplash.com/photo-1499914485622-a88fac536970?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9ubGluZSUyMGpvYnxlbnwwfHwwfHx8MA%3D%3D",
            jobtime:"full time",
          jobtitle: "Data Scientist",
          jobdes:
            "Analyze complex data sets to identify trends and insights, using statistical methods and machine learning techniques.",
        },
        {
          imagelink:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG9ubGluZSUyMGpvYnxlbnwwfHwwfHx8MA%3D%3D",
            jobtime:"full time",
          jobtitle: "Frontend Developer",
          jobdes:
            "Build responsive and interactive web interfaces using HTML, CSS, and JavaScript frameworks like React or Vue.js.",
        },
        {
          imagelink:
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9ubGluZSUyMGpvYnxlbnwwfHwwfHx8MA%3D%3D",
            jobtime:"part time",
          jobtitle: "Backend Developer",
          jobdes:
            "Design and implement server-side logic, manage databases, and ensure smooth data transfer between server and client.",
        },
      ];
  return (
    <div className='p-4'>
        <h2 className='text-3xl py-4 font-semibold text-center text-white'>Recommended jobs</h2>
        <div className="container">
        <div className="job-container  flex flex-wrap justify-center gap-5">
        {cardinfo.map((data)=>   <Link href={`/User/job/${data.jobtitle}`} key={data.jobtitle}><Jobcard  data={data}  /></Link>)}
     
      </div>
        </div>
    </div>
  )
}

export default page