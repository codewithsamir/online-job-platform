import { categoriActive, jobproviderActive, jobseekerActive } from '@/Ruduxtoolkit/registerSlice'
import React from 'react'
import { GiCrossMark } from 'react-icons/gi'
import { useDispatch } from 'react-redux'

const Categorysignup = () => {

    const dispatch = useDispatch()
  return (

    <div className="main w-full fixed left-0 right-0 top-0 bottom-0 backdrop-blur-md z-50">
<div className="formcontainer w-full sm:w-[500px] bg-[#af8dff65] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 p-5 sm:p-10 rounded-lg backdrop-blur-md">
        <GiCrossMark className="text-3xl text-white cursor-pointer hover:text-red-500 absolute right-4 top-4" 
    onClick={()=>dispatch(categoriActive(false))}
    />

          <h2 className="text-center font-bold  text-white text-3xl mb-5">Select Signup category</h2>

        <h2 className='w-full sm:w-[80%] h-full sm:h-[100px] rounded-lg px-2 py-4 bg-white my-8 mx-auto flex items-center justify-center text-xl text-center text-pink-500 cursor-pointer'
        onClick={()=>{
            dispatch(jobseekerActive(true))
            dispatch(categoriActive(false))

        }}
        >
        Jobseeker
        Create free account to apply!
        </h2>
        <h2 className='w-full sm:w-[80%] h-full sm:h-[100px] rounded-lg px-2 py-4 bg-white my-8 mx-auto flex items-center justify-center text-xl text-center text-pink-500 cursor-pointer'
          onClick={()=>{
            dispatch(jobproviderActive(true))
            dispatch(categoriActive(false))

        }}
        >
        Job Provider
Create free account to post vacancy

        </h2>
    </div>
    </div>
  )
}

export default Categorysignup