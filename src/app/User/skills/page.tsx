import Dashboardcard from '@/components/dashboard/dashboardcard'
import { Slidercourse } from '@/components/dashboard/slidercourse'
import React from 'react'

const page = () => {
  return (
    <div>
        <h2 className='text-3xl text-white text-center py-2 font-semibold'>Improve  Your skills</h2>
        <div className=" bg-[#AF8DFF] p-2 rounded-xl text-white my-4 text-center text-xl">
      <p>  With our course, we offer tests like typing speed tests and
        <br />
         coding logic-building exercises to enhance your skills.</p>
        </div>

<div className="cardshow flex justify-center gap-5 my-6">
    <Dashboardcard content='typing text' className='bg-green-500 cursor-pointer text-white text-3xl capitalize '  />
    <Dashboardcard content='coding test' className='bg-red-500 cursor-pointer  text-3xl capitalize text-white '  />
    <Dashboardcard content='mock test' className='bg-purple-500 cursor-pointer  text-3xl capitalize text-white '  />
</div>


        <div className="slider-test w-full m-auto">
            <h2 className='text-3xl text-white text-center py-2 font-semibold'>Our Courses</h2>
    <div className="bg-[#af8dff54] px-14 rounded-xl w-full h-[380px] flex items-center my-4 text-center text-xl">
    <Slidercourse/>
    </div>
        </div>
    </div>
  )
}

export default page