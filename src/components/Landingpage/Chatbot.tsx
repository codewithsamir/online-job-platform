import { CiLocationArrow1 } from "react-icons/ci";
import { chatbotActive } from '@/Ruduxtoolkit/registerSlice'
import React from 'react'
import { GiCrossMark } from 'react-icons/gi'
import { useDispatch } from 'react-redux'
import { Input } from '../ui/input'

const Chatbot = () => {
    const dispatch = useDispatch()
  return (
    <div className="forgotpassword w-[300px] sm:w-[400px] h-[400px] bg-[#af8dff65]  z-50 p-10 rounded-lg backdrop-blur-md relative">
    <GiCrossMark className="text-3xl text-white cursor-pointer hover:text-red-500 absolute right-4 top-4 " 
onClick={()=>dispatch(chatbotActive(false))}
/>

<div className="input flex w-[95%] justify-center items-center bg-white absolute bottom-0 left-2 rounded-md pr-3">
<Input type='text' placeholder='enter your question?'  className='w-full  outline-none text-lg focus-visible:ring-0   bg-transparent border-none'/>
<CiLocationArrow1 size={30} cursor={"pointer"}  />
</div>
</div>
  )
}

export default Chatbot