"use client"
import CompanyForm from '@/components/dashboard/companyform';
import Confirmemail from '@/components/dashboard/confirmemail';
import Header from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';
import UserProfileform from '@/components/dashboard/userProfileform';
import { updateUserPreferences } from '@/Ruduxtoolkit/authSlice';
import { fetchCandidates } from '@/Ruduxtoolkit/candidateSlice';
import { fetchCompanies } from '@/Ruduxtoolkit/companySlice';
import { useAppDispatch, useAppSelector } from '@/Ruduxtoolkit/hook';
import React, { use, useEffect } from 'react'

const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
        const dispatch = useAppDispatch();
        const { user,isLoading } = useAppSelector((state) => state.auth);
        const { companies, loading ,isadddone} = useAppSelector((state) => state.company);
      // console.log(companies)
        // Fetch candidates on component mount
        useEffect(() => {
           if (!user) return;
         
           if (!user.prefs || !user.prefs.isJobProvider) {
             dispatch(updateUserPreferences({ role: "job provider",
              isJobProvider: true
              }));
           }
         
           dispatch(fetchCompanies());
         }, [isadddone]);
         

      const menu = ["Dashboard","Add job","candidate","Profile"]

  return (


    <div className="bg-[#5B3E81] w-full">
    {/* Header */}
    <Header />

    {/* Main Content */}
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[250px] h-full bg-[#af8dff48] ">
        <Sidebar menu={menu} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen bg-[#2E2835] p-6 rounded-xl relative">
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : !user?.emailVerification ? (
          <Confirmemail />
        ) : companies?.length > 0 ? (
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