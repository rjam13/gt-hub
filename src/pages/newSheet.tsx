import { useRouter } from 'next/router';
import React from 'react';
import { trpc } from '~/utils/trpc';
import type { AppRouter } from '~/server/routers/_app';
import { inferProcedureInput } from '@trpc/server';
import { useSession } from 'next-auth/react';

const NewSheet = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const addTuningSheet = trpc.tuningSheet.add.useMutation({
    onSuccess: () => {
      router.push('/');
    },
  });

  return (
    <>
      <div>newSheet</div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const $form = e.currentTarget;
          const values = Object.fromEntries(new FormData($form));
          type Input = inferProcedureInput<AppRouter['tuningSheet']['add']>;
          const input: Input = {
            title: values.title as string,
            text: values.text as string,
            performancePoints: Number(values.performancePoints) as number,
            authorId: session?.user?.userId as string,
            carId: 'f1d7b3e1-233d-4121-91b4-a8258195e291', // 911 Turbo (930)
            status: 'draft',
          };
          try {
            await addTuningSheet.mutateAsync(input);
            $form.reset();
          } catch (cause) {
            console.error({ cause }, 'Failed to add tuning sheet');
          }
        }}
      >
        <label htmlFor="title">title:</label>
        <br />
        <input
          id="title"
          name="title"
          type="text"
          disabled={addTuningSheet.isLoading}
        />
        <label htmlFor="text">text:</label>
        <input
          id="text"
          name="text"
          type="text"
          disabled={addTuningSheet.isLoading}
        />
        <label htmlFor="performancePoints">performancePoints:</label>
        <input
          id="performancePoints"
          name="performancePoints"
          type="text"
          disabled={addTuningSheet.isLoading}
        />
        <input type="submit" disabled={addTuningSheet.isLoading} />
        {addTuningSheet.error && (
          <p style={{ color: 'red' }}>{addTuningSheet.error.message}</p>
        )}
      </form>
    </>
  );
};

export default NewSheet;

NewSheet.isProtected = true;
