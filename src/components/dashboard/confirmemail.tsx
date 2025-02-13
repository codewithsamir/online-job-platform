import React from 'react'
import { Button } from '../ui/button'

const Confirmemail = () => {
  return (
   
        <div className="box absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#af8dff56] w-[60%] h-[300px]  rounded-md flex justify-center items-center flex-col">
    
    <h3 className='my-4 text-xl text-white'>Verify your email to activate your account.</h3>
<Button variant="secondary" className='bg-[#FF0B7E] hover:bg-[#ff3d98] text-xl text-white'>confirm</Button>

</div>
    
  )
}

export default Confirmemail