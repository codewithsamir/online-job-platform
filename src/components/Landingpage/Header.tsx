"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Navlinks from "./Navlinks";
import { RxHamburgerMenu } from "react-icons/rx";

import { loginActive } from "@/Ruduxtoolkit/registerSlice";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"; // Import Avatar components
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook"; // Import typed useSelector
import { getUser } from "@/Ruduxtoolkit/authSlice";
import { useRouter } from "next/navigation";

const Header = () => {
  const [close, setClose] = useState(false);
  const dispatch = useAppDispatch();

  // Get the user from the Redux state
  const { user } = useAppSelector((state) => state.auth);
const router = useRouter()
  // Handle sidebar toggle
  const sidebarHandle = () => {
    setClose(!close);
  };
// console.log(user)
  // Fetch user data on component mount


  return (
    <header className="bg-[#2a1b3d] px-4 sm:px-10 py-2 sm:py-5 flex justify-between items-center">
      {/* Logo */}
      <div className="logo">
        <Link href={"/"}>
          <h1 className="text-2xl mb-3 sm:mb-0 sm:text-3xl capitalize text-white">
            Online Job Portal
          </h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <Navlinks close={close} setClose={setClose} />

      {/* Login Button or User Avatar */}
      <div className="btn flex justify-between sm:justify-center gap-3 items-center">
        {user ? (
          // Show Avatar if user is logged in
          <Avatar 
          className="cursor-pointer"
          onClick={() =>router.push(`${user?.prefs?.role === "job seeker" ? "/User/dashboard" : "/Jobprovider/dashboard"}`)}
          >
            {/* <AvatarImage src={user?.avatarUrl || ""} alt={user.name || "User"} /> */}
            <AvatarFallback>
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          // Show Login Button if user is not logged in
          <Button
            className="border-none bg-[#D83F87] hover:bg-[#f54698]"
            onClick={() => dispatch(loginActive(true))}
          >
            Sign Up
          </Button>
        )}

        {/* Hamburger Menu for Mobile */}
        <RxHamburgerMenu
          color="white"
          size={40}
          className="lg:hidden"
          onClick={sidebarHandle}
        />
      </div>
    </header>
  );
};

export default Header;