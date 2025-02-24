"use client"
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAppDispatch } from '@/Ruduxtoolkit/hook';
import { sendEmailVerify } from '@/Ruduxtoolkit/emailverifySlice';
import { toast } from 'sonner';

const Confirmemail = () => {
  const dispatch = useAppDispatch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to track button's disabled status

  // Function to send verification email
  const sendVerificationEmail = async () => {
    try {
      setIsButtonDisabled(true); // Disable the button immediately when clicked
      await dispatch(sendEmailVerify()).unwrap(); // Dispatch the action and wait for it to complete
      toast.success("Verification email sent successfully!", {
        position: "top-center",
        richColors: true,
      });
    } catch (error: any) {
      console.error("Error sending verification email:", error.message);
      toast.error("Failed to send verification email. Please try again.", {
        position: "top-center",
        richColors: true,
      });
    } finally {
      setIsButtonDisabled(true); // Ensure the button remains disabled after the process
    }
  };

  return (
    <div className="box absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#af8dff56] w-[60%] h-[300px] rounded-md flex justify-center items-center flex-col">
      <h3 className="my-4 text-xl text-white">Verify your email to activate your account.</h3>
      <Button
        variant="secondary"
        className={`text-xl text-white ${
          isButtonDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#FF0B7E] hover:bg-[#ff3d98]'
        }`}
        onClick={sendVerificationEmail} // Attach the function to the button's onClick
        disabled={isButtonDisabled} // Disable the button based on the state
      >
        {isButtonDisabled ? "Email Sent" : "Send Verification Email"}
      </Button>
    </div>
  );
};

export default Confirmemail;