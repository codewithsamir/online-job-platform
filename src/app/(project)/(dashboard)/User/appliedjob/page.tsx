
import Dashboardtable from '@/components/dashboard/dashboradTable'
import React from 'react'

const page = () => {
  return (
    <div>
        <h2 className='text-3xl font-semibold text-center capitalize text-white my-4'>Applied jobs</h2>

        <div className="jobshow bg-[#af8dff3c] p-2 rounded-xl text-white my-4 text-center text-xl">
            <Dashboardtable />
        </div>
    </div>
  )
}

export default page