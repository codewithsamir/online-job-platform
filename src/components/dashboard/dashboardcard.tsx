import React from 'react'

const Dashboardcard = ({content,className,contentdata}:{content:string,className:string,contentdata ?:number}) => {
  return (
    <div className={`w-[300px] h-[150px] flex flex-col justify-center items-center p-4 rounded-lg ${className}`} >
        <p className='text-3xl '>{contentdata && contentdata}</p>
        <p className=''>{content}</p>
    </div>
  )
}

export default Dashboardcard