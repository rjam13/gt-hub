import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { Fragment } from 'react';
import Link from 'next/dist/client/link';
import { trpc } from '~/utils/trpc';
import Widget from '~/frontend/components/Widget';
import exampleModel from '~/frontend/assets/porsche_911_Turbo_(930)_81.png';
import Image from 'next/image';

const ManufacturerPage: NextPageWithLayout = () => {
  const router = useRouter();
  const name = router.query.manufacturer as string;
  const carModelsQuery = trpc.manufacturer.byName.useQuery({ name });

  if (carModelsQuery.error) {
    return (
      <NextError
        title={carModelsQuery.error.message}
        statusCode={carModelsQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (carModelsQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = carModelsQuery;
  return (
    <div className="flex flex-col items-center">
      <Widget header={data?.name} width="max-w-[800px]">
        {data?.models.map((model, index) => (
          <Fragment key={index}>
            <Link
              href={`/cars/${name}/${model.name}`}
              className="text-white hover:text-slate-300 border border-transparent hover:border-white bg-select-box flex justify-start items-center rounded-md h-12 gap-2 mx-4 my-2"
            >
              <div className="h-full w-4/12">
                <Image
                  src={exampleModel}
                  alt="Car Model Example"
                  className="h-full object-cover rounded-md"
                />
              </div>
              <p className="font-light w-8/12">{model.name}</p>
            </Link>
          </Fragment>
        ))}
      </Widget>
    </div>
  );
};

export default ManufacturerPage;

// ManufacturerPage.isProtected = true;
