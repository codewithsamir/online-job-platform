"use client";
import React from "react";
import Login from "./Login";
import Forgotpassword from "./Forgotpassword";
import Categorysignup from "./Categorysignup";
import Jobseekeraccount from "./Jobseekeraccount";
import Jobprovideraccount from "./Jobprovideraccount";
import { useAppSelector } from "@/Ruduxtoolkit/hook"; // Use typed useSelector

const Registerwrapper = () => {
  // Use typed selector to avoid `any`
  const isActive = useAppSelector((state) => state.registeractive);

  return (
    <div>
      {/* Render components based on active state */}
      {isActive.isActivelogin && <Login />}
      {isActive.isActiveforgotpassword && <Forgotpassword />}
      {isActive.isActivecategori && <Categorysignup />}
      {isActive.isActivejobseeker && <Jobseekeraccount />}
      {isActive.isActivejobprovider && <Jobprovideraccount />}
    </div>
  );
};

export default Registerwrapper;