import React from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const Header = () => {
  return (
    <header className='flex justify-between items-center px-8 py-4 bg-[#5B3E81] sticky top-0 z-50'>
        <div className="logo">
            <h2 className='text-3xl font-semibold font-mono text-[#D83F87] capitalize'>online  job portal</h2>
        </div>
        <div className="last flex items-center gap-6">
            <Button variant="secondary" className='bg-[#D83F87] text-white hover:bg-[#ff3bb1]'>Logout</Button>
            <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
        </div>
    </header>
  )
}

export default Header