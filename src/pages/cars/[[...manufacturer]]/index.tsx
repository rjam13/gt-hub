import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from '~/pages/_app';
import { Fragment } from 'react';
import Link from 'next/dist/client/link';
import Widget from '~/frontend/components/Widget';
import Image from 'next/image';
import manuLogoExample from '~/frontend/assets/manuLogoExample.png';
import exampleModel from '~/frontend/assets/porsche_911_Turbo_(930)_81.png';
import { useRouter } from 'next/router';

const Cars: NextPageWithLayout = () => {
  const router = useRouter();
  const slug = router.query.manufacturer?.[0];
  let manufacturerSelected = '';
  if (slug !== undefined) manufacturerSelected = slug;
  console.log(manufacturerSelected);

  const manufacturerQuery = trpc.manufacturer.getAll.useQuery(undefined);
  const carModelsQuery = trpc.manufacturer.byName.useQuery(
    {
      name: manufacturerSelected,
    },
    {
      onSuccess(data) {
        console.log(data);
      },
    },
  );

  if (
    manufacturerQuery.status !== 'success' &&
    carModelsQuery.status !== 'success'
  ) {
    return <>Loading...</>;
  }

  const { data } = carModelsQuery;
  return (
    <div className="flex items-start justify-center flex-col md:flex-row max-w-screen-xl mx-auto">
      <div className="md:basis-1/2">
        <Widget header="Manufacturers">
          <div className="flex justify-center flex-wrap">
            {manufacturerQuery.data?.map((manu, index) => (
              <Fragment key={index}>
                <Link
                  href={`/cars/${manu.name}`}
                  onClick={() => {
                    console.log('lol');
                  }}
                  className="text-white hover:text-slate-300 border border-transparent hover:border-white w-[31%] aspect-square min-w-[110px] min-h-[110px] max-w-[250px] max-h-[250px] bg-select-box flex pt-4 pb-2.5 justify-between items-center flex-col m-1 rounded-md"
                >
                  <Image
                    src={manuLogoExample}
                    alt="Manufacturer Example Logo"
                    className="h-7/12 w-7/12"
                  />
                  <div className="grow flex items-center">
                    <p className="font-light m-auto">{manu.name}</p>
                  </div>
                </Link>
              </Fragment>
            ))}
          </div>
        </Widget>
      </div>

      {manufacturerSelected !== '' && (
        <div className="md:basis-1/2">
          <Widget header={data?.name ?? ''}>
            {data?.models.map((model, index) => (
              <Fragment key={index}>
                <Link
                  href="/"
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
      )}
    </div>
  );
};

export default Cars;

// Cars.isProtected = true;
