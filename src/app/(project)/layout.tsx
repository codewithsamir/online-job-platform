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

  useEffect(() => {
    
        
           dispatch(getUser()).unwrap(); // Dispatch the thunk action
      
    
    

   
  }, [dispatch, isAuthenticated]); // Re-run when isAuthenticated changes

  return <>{children}</>;
}