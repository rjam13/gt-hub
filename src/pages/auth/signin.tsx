import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { InferGetServerSidePropsType } from 'next';
import { logger } from '~/utils/logger';
import {
  ICheckCredentials,
  checkCredentialsSchema,
} from '~/schemas/userSchema';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

// https://github.com/FranciscoMendes10866/next-auth-trpc-prisma/blob/main/src/pages/index.tsx

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { handleSubmit, control, reset } = useForm<ICheckCredentials>({
    defaultValues: {
      name: '',
      password: '',
    },
    resolver: zodResolver(checkCredentialsSchema),
  });

  // const defaultBody = {
  //   grant_type: '',
  //   username: 'asdf',
  //   scope: '',
  //   client_id: '',
  //   client_secret: '',
  // };

  const onSubmit = useCallback(
    async (data: ICheckCredentials) => {
      try {
        // const body = { ...defaultBody, userData: { ...data } };
        // console.log(`POSTing ${JSON.stringify(body, null, 2)}`);
        const res = await signIn('credentials', {
          ...data,
          callbackUrl: router.query.callbackUrl as string,
        });
        logger.debug(`signing:onsubmit:res`, res);
        reset();
      } catch (error) {
        logger.error(error);
      }
    },
    [reset, router.query.callbackUrl],
  );

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input type="text" placeholder="username" {...field} />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input type="password" placeholder="password" {...field} />
          )}
        />
        <input type="submit" value="Sign In" />
      </form>
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
