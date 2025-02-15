"use client"
import CompanyForm from '@/components/dashboard/companyform';
import Confirmemail from '@/components/dashboard/confirmemail';
import Header from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';
import UserProfileform from '@/components/dashboard/userProfileform';
import { fetchCandidates } from '@/Ruduxtoolkit/candidateSlice';
import { useAppDispatch, useAppSelector } from '@/Ruduxtoolkit/hook';
import React, { useEffect } from 'react'

const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
        const dispatch = useAppDispatch();
        const { user } = useAppSelector((state) => state.auth);
        const { candidates, loading } = useAppSelector((state) => state.candidate);
      console.log(candidates)
        // Fetch candidates on component mount
        useEffect(() => {
          
            dispatch(fetchCandidates());
          
        }, [dispatch]);

      const menu = ["Dashboard","Add job","candidate","Profile"]

  return (


    <div className="bg-[#5B3E81] w-full">
    {/* Header */}
    <Header />

    {/* Main Content */}
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[250px] bg-[#af8dff48] ">
        <Sidebar menu={menu} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen bg-[#2E2835] p-6 rounded-xl relative">
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : !user?.emailVerification ? (
          <Confirmemail />
        ) : candidates?.total > 0 ? (
          children
        ) : (
          <CompanyForm />
        )}
      </div>
    </div>
  </div>



  )
}

export default layout