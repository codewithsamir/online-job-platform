import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div className='bg-[#5B3E81] w-full min-h-screen flex justify-center items-center'>
        <div className="box bg-[#af8dff56] w-[60%] h-[450px]  rounded-md flex justify-center items-center flex-col">
<div className="icon ">
    <img src="/checkicon.png" alt="checkicon" />
</div>
<p className='text-white text-center py-4 text-xl w-2/3'>
Your email has been <span className='text-green-500'>successfully activated! </span>
<br />
You can now access in to your account.
</p>
<Button variant="secondary" className='bg-green-600 hover:bg-green-500 text-xl text-white'>Return</Button>
        </div>
    </div>
  )
}

export default page