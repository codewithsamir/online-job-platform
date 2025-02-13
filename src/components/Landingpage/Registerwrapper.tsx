"use client";
import React from "react";
import Login from "./Login";
import { useSelector } from "react-redux";
import Forgotpassword from "./Forgotpassword";
import Categorysignup from "./Categorysignup";
import Jobseekeraccount from "./Jobseekeraccount";
import Jobprovideraccount from "./Jobprovideraccount";

const Loginwrapper = () => {
  const isactive = useSelector((state: any) => state.registeractive);
  
//   console.log(isloginactive);
  return <div >
    {isactive.isActivelogin && <Login /> } 
    {isactive.isActiveforgotpassword && <Forgotpassword />}
    {isactive.isActivecategori &&  <Categorysignup />}
    {isactive.isActivejobseeker &&    <Jobseekeraccount />}
    {isactive.isActivejobprovider &&    <Jobprovideraccount />}
  
 
  </div>;
};

export default Loginwrapper;
