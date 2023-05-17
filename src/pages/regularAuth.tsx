import { useSession, signIn, signOut } from 'next-auth/react';

const RegularAuth = () => {
  const { data, status } = useSession();
  if (status === 'loading') return <h1> loading... please wait</h1>;
  if (status === 'authenticated') {
    return (
      <div>
        <h1>Server-side Authentication Example - Welcome User!</h1>
        <button
          onClick={() => {
            signOut();
          }}
        >
          sign out
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Server-side Authentication Example - Welcome Stranger!</h1>
        <button onClick={() => signIn('google')}>sign in with gooogle</button>
      </div>
    );
  }
};

export default RegularAuth;
