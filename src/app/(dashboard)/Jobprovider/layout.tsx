"use client";
import CompanyForm from '@/components/dashboard/companyform';
import Header from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';
import { updateUserPreferences } from '@/Ruduxtoolkit/authSlice';
import { fetchCompanies } from '@/Ruduxtoolkit/companySlice';
import { useAppDispatch, useAppSelector } from '@/Ruduxtoolkit/hook';
import React, { useEffect, useState } from 'react';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { companies, loading: companiesLoading } = useAppSelector((state) => state.company);
  
  const [isFetched, setIsFetched] = useState(false);

  // Fetch companies on mount
  useEffect(() => {
    if (!user) return;

    if (!user.prefs || !user.prefs.isJobProvider) {
      dispatch(updateUserPreferences({ role: "job provider", isJobProvider: true }));
    }

    dispatch(fetchCompanies()).finally(() => setIsFetched(true));
  }, [user, dispatch]);

  const menu = ["Dashboard", "Add job", "candidate", "Profile"];

  return (
    <div className="bg-[#5B3E81] w-full">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-[250px] h-full bg-[#af8dff48]">
          <Sidebar menu={menu} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen bg-[#2E2835] p-6 rounded-xl relative">
          {(!isFetched || companiesLoading) ? null : companies?.length > 0 ? (
            children
          ) : (
            <CompanyForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
