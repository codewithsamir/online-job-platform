import React from 'react'
import Dashboardcard from './dashboardcard'
import  Dashboardtable  from './dashboradTable'
import { Dashboardchart } from './dashboardchart'

const Dashboardpage = () => {
  return (
    <div className='w-full space-y-6'>
        <div className="top flex flex-wrap gap-6 ">
            <Dashboardcard content='Total Users' className='bg-orange-400' contentdata={100}/>
            <Dashboardcard content='Total Job Reject' className='bg-red-800' contentdata={10}/>
            <Dashboardcard content='Total confirm job' className='bg-green-600' contentdata={100}/>
        </div>
        <div className="table w-full">
            <Dashboardtable/>
        </div>
        <div className="charts">
            <Dashboardchart/>
        </div>
    </div>
  )
}

export default Dashboardpage