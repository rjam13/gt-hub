import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from '~/pages/_app';
import { Fragment } from 'react';
import Link from 'next/dist/client/link';
import Widget from '~/frontend/components/Widget';
import Image from 'next/image';
import manuLogoExample from '~/frontend/assets/manuLogoExample.png';
import exampleModel from '~/frontend/assets/porsche_911_Turbo_(930)_81.png';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';

const Cars: NextPageWithLayout = () => {
  const router = useRouter();
  const slug = router.query.manufacturer?.[0];
  let manufacturerSelected = '';
  if (slug !== undefined) manufacturerSelected = slug;

  const manufacturerQuery = trpc.manufacturer.getAll.useQuery(undefined);

  if (manufacturerQuery.status !== 'success') {
    return <>Loading...</>;
  }

  const { data } = manufacturerQuery;

  return (
    <div className="flex items-start justify-center flex-col md:flex-row max-w-screen-xl mx-auto">
      <div className="md:basis-1/2">
        <Widget header="Manufacturers">
          <div className="flex justify-center flex-wrap">
            {data.map((manu, index) => (
              <Fragment key={index}>
                <Link
                  href={`/cars/${manu.name}`}
                  className={`text-white hover:text-slate-300 border border-transparent hover:border-white w-[31%] aspect-square min-w-[110px] min-h-[110px] max-w-[250px] max-h-[250px] bg-card pt-4 pb-2.5 m-1 rounded-md grid grid-rows-[66%_33%] ${
                    manu.name === manufacturerSelected &&
                    'text-slate-300 border-white'
                  }
                  `}
                >
                  {/* <div className="h-7/12 w-7/12 flex flex-col justify-center bg-orange-500">
                    <CldImage
                      src={manu.image != null ? manu.image : ''}
                      alt={`${manu.name} Logo`}
                      width={400}
                      height={400}
                      className="h-full w-full object-contain overflow-hidden"
                    />
                  </div> */}
                  {/* 70 25 */}
                  <CldImage
                    src={manu.image != null ? manu.image : ''}
                    alt={`${manu.name} Logo`}
                    width={400}
                    height={400}
                    className="h-full object-contain row-start-1 row-end-2 px-6"
                  />
                  <div className="grow flex items-center row-start-2 row-end-3">
                    <p className="font-light m-auto">{manu.name}</p>
                  </div>
                </Link>
              </Fragment>
            ))}
          </div>
        </Widget>
      </div>

      {data.map((manu, index) => (
        <div
          key={index}
          className={`md:basis-1/2 ${
            manufacturerSelected == manu.name ? 'block' : 'hidden'
          }`}
        >
          <Widget header={manu.name ?? ''}>
            {manu.models.map((model, index) => (
              <Fragment key={index}>
                <Link
                  href={`/${model.name}`}
                  className="text-white hover:text-slate-300 border border-transparent hover:border-white bg-card flex justify-start items-center rounded-md h-12 gap-2 mx-4 my-2"
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
      ))}
    </div>
  );
};

export default Cars;

// Cars.isProtected = true;
