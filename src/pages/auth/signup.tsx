import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { inferProcedureInput } from '@trpc/server';
import { AppRouter } from '~/server/routers/_app';
import { trpc } from '~/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema } from '~/schemas/userSchema';
// import * as z from 'zod';

const SignUp = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    // formState: { errors, isSubmitting },
  } = useForm();
  // } = useForm({
  //   //** RESEARCH MORE ON THIS IDK WHAT IT DOES **
  //   resolver: zodResolver(userCreateSchema),
  // });

  const createUser = trpc.user.create.useMutation({
    async onSuccess() {
      reset();
      router.push(
        `signin${
          router.query.callbackUrl
            ? `?callbackUrl=${router.query.callbackUrl}`
            : ''
        }`,
      );
    },
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit(async (values) => {
          // userCreateSchema should match userCreateInput
          type userCreateInput = inferProcedureInput<
            AppRouter['user']['create']
          >;
          const input: userCreateInput = {
            email: values.email as string,
            password: values.password as string,
            name: values.username as string,
          };
          try {
            await createUser.mutateAsync(input);
          } catch (error) {
            console.error(error);
          }
        })}
      >
        <input type="text" {...register('username')} placeholder="username" />
        <input type="email" {...register('email')} placeholder="email" />
        <input
          type="password"
          {...register('password')}
          placeholder="password"
        />
        <input type="submit" value="Sign Up" />
      </form>
    </div>
  );
};

export default SignUp;
