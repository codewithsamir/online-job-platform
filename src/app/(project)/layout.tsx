"use client";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import { getUser } from "@/Ruduxtoolkit/authSlice";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch user data if not already authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      dispatch(getUser()).unwrap() // Dispatch the thunk action to fetch user data
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // toast.error("Failed to fetch user data. Please try again.");
        });
    }
  }, [dispatch, isAuthenticated]);



  // Render children only if the user is authenticated or on the correct page
  return <>{children}</>;
}