'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem('portfolio-theme');
        sessionStorage.clear();
        signOut({ callbackUrl: '/admin/login' });
      }}
      className={className}
    >
      Sign out
    </button>
  );
}
