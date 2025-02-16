"use client";
import { useEffect, ReactNode } from "react"; // Import ReactNode
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import { getUser } from "@/Ruduxtoolkit/authSlice";

interface RootLayoutProps {
  children: ReactNode; // Explicitly define children type
}

export default function RootLayout({ children }: RootLayoutProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch user data if not authenticated and user data is missing
  useEffect(() => {
    if (!isAuthenticated && !user) {
      dispatch(getUser()).unwrap().then((res)=>{
        console.log(res)
      }).catch((error) => {
        router.replace("/");
        console.error("Error fetching user data:", error);
      });
    }
  }, [dispatch, isAuthenticated, user]);

 
  // Show a loading indicator while fetching user data
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Render children only if authentication is determined
  return <>{children}</>;
}
