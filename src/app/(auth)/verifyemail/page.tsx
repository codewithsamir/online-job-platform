"use client"; // Mark this as a client component

import { Button } from '@/components/ui/button';
import { updateEmailVerify } from '@/Ruduxtoolkit/emailverifySlice';
import { useAppDispatch } from '@/Ruduxtoolkit/hook';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Suspense } from 'react'; // Import Suspense for wrapping

const EmailVerificationPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || ''; // Default to empty string if null
  const secret = searchParams.get('secret') || ''; // Default to empty string if null
  const dispatch = useAppDispatch();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  // Handle email confirmation
  const handleConfirm = async () => {
    try {
      setIsLoading(true); // Start loading
      await dispatch(updateEmailVerify({ userId, secret })).unwrap(); // Dispatch action and wait for it to complete
      setIsConfirmed(true); // Update confirmation status
      router.push('/emailverified'); // Redirect to the emailverified page
    } catch (error: any) {
      console.error('Error confirming email:', error.message);
      alert('Failed to confirm email. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-[#5B3E81] w-full min-h-screen flex justify-center items-center">
      <div className="box bg-[#af8dff56] w-[60%] h-[450px] rounded-md flex justify-center items-center flex-col">
        <div className="icon">
          <img src="/emailicon.png" alt="Email Icon" className="w-20 h-20" />
        </div>
        <p className="text-white text-center py-4 text-xl">
          Please click the confirm button to activate your email.
          <br />
          Once confirmed, you can access your account.
        </p>
        <Button
          variant="secondary"
          className="bg-[#FF0B7E] hover:bg-[#ff3d98] text-xl text-white"
          onClick={handleConfirm}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Confirming...' : 'Confirm'}
        </Button>
      </div>
    </div>
  );
};

// Wrap the component in a Suspense boundary
const EmailVerificationPageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationPage />
    </Suspense>
  );
};

export default EmailVerificationPageWithSuspense;