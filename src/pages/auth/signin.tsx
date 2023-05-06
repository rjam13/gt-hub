import React, { useEffect, useState } from 'react';
import {
  ClientSafeProvider,
  getProviders,
  signIn,
  useSession,
} from 'next-auth/react';
import { useRouter } from 'next/router';
import { InferGetServerSidePropsType } from 'next';

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [router, session]);
  const [userInfo, setUserInfo] = useState({ username: '', password: '' });

  // console.log(providers);
  return (
    <div>
      <h1>Sign In</h1>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await signIn('credentials', {
              redirect: false,
              username: userInfo.username,
              password: userInfo.password,
            });
            console.log(res);
          }}
        >
          <input
            value={userInfo.username}
            onChange={({ target }) => {
              setUserInfo({ ...userInfo, username: target.value });
            }}
            type="username"
            placeholder="username"
          />
          <input
            value={userInfo.password}
            onChange={({ target }) => {
              setUserInfo({ ...userInfo, password: target.value });
            }}
            type="password"
            placeholder="password"
          />
          <input type="submit" value="Login" />
        </form>
      </div>
      <h3>OR</h3>
      {providers != null ? (
        Object.values(providers).map((provider) => {
          if (provider.id !== 'credentials') {
            return (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                  Login by {provider.name}
                </button>
              </div>
            );
          }
        })
      ) : (
        <div></div>
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers: providers,
    },
  };
};

export default SignIn;
