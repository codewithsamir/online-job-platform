"use client";
import { getUser } from "@/Ruduxtoolkit/authSlice";
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user,isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();

 

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/"); // Redirect to home page if no user
    }
  }, [isLoading, user, router]);

  // Show a loading indicator while fetching user data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render children only if the user is authenticated
  return <>{children}</>;
}