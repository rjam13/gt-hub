import { GetServerSideProps } from 'next';
import type { Session } from 'next-auth';
import { getSession, useSession, signIn, signOut } from 'next-auth/react';

interface Props {
  isLoggedIn: boolean;
  session: Session | null;
}

const ServerAuth = ({ isLoggedIn }: Props) => {
  const { data: session } = useSession();
  // below is not needed because getServerSideProps always loads the session beforehand
  // const { data: session, status } = useSession();
  // const loading = status === 'loading';

  console.log({ session });
  if (isLoggedIn) {
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

export default ServerAuth;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const session = await getSession(context);
  return {
    props: {
      isLoggedIn: !(session == null),
      session, // we don't need to pass this into the props of ServerAuth as useSession will give it to us
    },
  };
};
