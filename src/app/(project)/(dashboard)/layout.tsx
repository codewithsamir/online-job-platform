"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isLoading } = useAppSelector((state) => state.auth);

 
  // Redirect logic based on authentication status and user role
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on user role
        if (user.prefs?.role === "job provider") {
          router.replace("/Jobprovider/dashboard");
        } else if (user.prefs?.role === "job seeker") {
          router.replace("/User/dashboard");
        } else {
          console.error("Role not defined for this user.");
        }
      } else {
        // If user is not logged in, ensure they stay on the landing page
        if (window.location.pathname !== "/") {
          router.replace("/");
        }
      }
    }
  }, [ user]);

  // Show a loading indicator while fetching user data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render children only if the user is authenticated or on the correct page
  return <>{children}</>;
}