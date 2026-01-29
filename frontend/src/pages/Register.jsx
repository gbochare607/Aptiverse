import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <SignUp signInUrl="/login" forceRedirectUrl="/dashboard" />
        </div>
    );
}
