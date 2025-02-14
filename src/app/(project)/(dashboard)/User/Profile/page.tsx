import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div>
        <h2 className='text-3xl font-semibold text-center capitalize text-white my-4'>My Information</h2>

 
    <div className="jobshow  mx-auto my-4   w-[70%] h-[500px] bg-[#af8dff3c] px-10 py-4 rounded-xl text-white  text-center text-xl flex gap-6 justify-center ">
        <div className="image w-[150px] h-[150px] bg-[#d9d9d945] rounded-md "></div>

        <div className="info rounded-md bg-[#d9d9d945] w-[400px] h-full text-left p-6 flex justify-between">
            
          
                <div className="fullinfo">
                <p className='capitalize'>name: <span className='font-semibold'>samir</span></p>
                </div>

                <div className="button">
                <Button variant="secondary" className='bg-[#FF0B7E] hover:bg-pink-600 text-white'> update</Button>
            </div>
         
        </div>
         
        </div>
    
    </div>
  )
}

export default page