'use client';

import { Suspense } from 'react';
import ResetPasswordClient from './client';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg text-gray-600">Loading...</div></div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
