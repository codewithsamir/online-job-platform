"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import { getUser } from "@/Ruduxtoolkit/authSlice";
import { toast } from "sonner"; // For toast notifications

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch user data if not already authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      dispatch(getUser()).unwrap() // Dispatch the thunk action to fetch user data
        .catch((error) => {
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data. Please try again.");
        });
    }
  }, [dispatch, isAuthenticated]);

  // Redirect logic based on authentication status and user role
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on user role
        if (user.prefs?.role === "job provider") {
          router.replace("/Jobprovider/Dashboard");
        } else if (user.prefs?.role === "job seeker") {
          router.replace("/User/Dashboard");
        } else {
          toast.error("Role not defined for this user.");
        }
      } else {
        // If user is not logged in, ensure they stay on the landing page
        if (window.location.pathname !== "/") {
          router.replace("/");
        }
      }
    }
  }, [isLoading, user, router]);

  // Show a loading indicator while fetching user data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render children only if the user is authenticated or on the correct page
  return <>{children}</>;
}