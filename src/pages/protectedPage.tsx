import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn(undefined, {
        callbackUrl: window.location.href,
      });
    },
  });

  if (status === 'loading') {
    return 'Loading...';
  }

  return <>{children}</>;
};

export default ProtectedPage;
