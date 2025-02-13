import Confirmemail from '@/components/dashboard/confirmemail';
import Header from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';
import UserProfileform from '@/components/dashboard/userProfileform';
import React from 'react'

const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
      const show:boolean = false;

      const menu = ["Dashboard","job","skills","applied job","Resume builder","Profile"]

  return (


<div className="bg-[#5B3E81] w-full " >
  <Header  />

  <div className="flex min-h-screen">
    {/* Sidebar */}
    <div className="">
      <Sidebar menu={menu}/>
    </div>

    {/* Main Content */}
    <div className="w-full min-h-screen bg-[#2E2835] p-6 rounded-xl  relative">
   
      {/* {show ? <Confirmemail/> : <UserProfileform/>} */}
      {children}
    </div>
  </div>
</div>



  )
}

export default layout