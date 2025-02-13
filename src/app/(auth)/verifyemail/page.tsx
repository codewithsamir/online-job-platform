import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div className='bg-[#5B3E81] w-full min-h-screen flex justify-center items-center'>
        <div className="box bg-[#af8dff56] w-[60%] h-[450px]  rounded-md flex justify-center items-center flex-col">
<div className="icon ">
    <img src="/emailicon.png" alt="" />
</div>
<p className='text-white text-center py-4 text-xl '>
Please click the confirm button to activate your email.
<br />
Once confirmed, you can access in to your account.
</p>
<Button variant="secondary" className='bg-[#FF0B7E] hover:bg-[#ff3d98] text-xl text-white'>confirm</Button>
        </div>
    </div>
  )
}

export default page