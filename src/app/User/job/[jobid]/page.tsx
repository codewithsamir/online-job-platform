import Jobdescription from '@/components/Landingpage/Jobdescription'
import React from 'react'

const page = ({params}:any) => {
    const title =decodeURIComponent(params.jobid)
  return (
    <div>
        <Jobdescription data={title} classNames="text-white" />
    </div>
  )
}

export default page