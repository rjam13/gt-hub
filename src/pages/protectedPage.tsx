import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProtectedPage = () => {
  const { push } = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push('/');
    },
  });

  if (status === 'loading') {
    return 'Loading...';
  }

  return 'User is logged in';
};

export default ProtectedPage;
