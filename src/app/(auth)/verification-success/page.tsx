// src/app/(auth)/verification-success/page.tsx
'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function VerificationSuccess() {
  useEffect(() => {
    // Refresh the session to get updated user data
    const refreshSession = async () => {
      try {
        const response = await fetch('/api/auth/refresh', { method: 'POST' });
        if (!response.ok) {
          console.error('Failed to refresh session');
        }
      } catch (error) {
        console.error('Error refreshing session:', error);
      }
    };

    refreshSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-green-500">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verified Successfully!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your email has been verified. Your account is now pending approval from an administrator.
            You will receive an email once your account has been approved.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}