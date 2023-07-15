import { trpc } from '../../utils/trpc';
import { inferProcedureInput } from '@trpc/server';
import { NextPageWithLayout } from '~/pages/_app';
import { ReactElement, Fragment } from 'react';
import type { AppRouter } from '~/server/routers/_app';
import Link from 'next/dist/client/link';

const Cars: NextPageWithLayout = () => {
  const manufacturerQuery = trpc.manufacturer.getAll.useQuery(undefined);
  const addManufacturer = trpc.manufacturer.add.useMutation({
    onSuccess: () => {
      void manufacturerQuery.refetch();
    },
  });

  return (
    <div>
      <h1>Cars</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const $form = e.currentTarget;
          const values = Object.fromEntries(new FormData($form));
          type Input = inferProcedureInput<AppRouter['manufacturer']['add']>;
          const input: Input = {
            name: values.manufacturer as string,
            yearFounded: Number(values.yearFounded) as number,
            headquarters: values.headquarters as string,
          };
          try {
            await addManufacturer.mutateAsync(input);
            $form.reset();
          } catch (cause) {
            console.error({ cause }, 'Failed to add manufacturer');
          }
        }}
      >
        <label htmlFor="manufacturer">manufacturer:</label>
        <br />
        <input
          id="manufacturer"
          name="manufacturer"
          type="text"
          disabled={addManufacturer.isLoading}
        />
        <label htmlFor="yearFounded">yearFounded:</label>
        <input
          id="yearFounded"
          name="yearFounded"
          type="text"
          disabled={addManufacturer.isLoading}
        />
        <label htmlFor="headquarters">headquarters:</label>
        <input
          id="headquarters"
          name="headquarters"
          type="text"
          disabled={addManufacturer.isLoading}
        />
        <input type="submit" disabled={addManufacturer.isLoading} />
        {addManufacturer.error && (
          <p style={{ color: 'red' }}>{addManufacturer.error.message}</p>
        )}
      </form>
      {manufacturerQuery.data?.map((manu, index) => (
        <Fragment key={index}>
          <Link href={`/cars/${manu.name}`}>
            <div>
              <b>{manu.name}</b>, {manu.yearFounded}, {manu.headquarters}
            </div>
          </Link>
        </Fragment>
      ))}
    </div>
  );
};

export default Cars;

// Cars.isProtected = true;
