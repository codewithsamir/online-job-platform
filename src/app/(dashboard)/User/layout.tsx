"use client";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import UserProfileform from "@/components/dashboard/userProfileform";
import { updateUserPreferences } from "@/Ruduxtoolkit/authSlice";
import { fetchCandidates } from "@/Ruduxtoolkit/candidateSlice";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import React, { useEffect } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { candidates } = useAppSelector((state) => state.candidate);

  // Fetch candidates on component mount
  useEffect(() => {
    if (!user) return;

    if (!user.prefs || !user.prefs.role) {
      dispatch(updateUserPreferences({ role: "job seeker" }));
    }

    dispatch(fetchCandidates());
  }, [user?.prefs?.role, dispatch]);

  // Define the menu items for the sidebar
  const menu = ["Dashboard", "Job", "Applied Jobs", "Profile"];

  // Check if candidate profile exists
  const isProfileComplete = candidates && candidates.length > 0;

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
          {isProfileComplete ? children : <UserProfileform />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
