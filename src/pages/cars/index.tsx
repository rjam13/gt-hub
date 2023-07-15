import { trpc } from '../../utils/trpc';
import { NextPageWithLayout } from '~/pages/_app';
import { Fragment } from 'react';
import Link from 'next/dist/client/link';
import Widget from '~/frontend/components/Widget';
import Image from 'next/image';
import manuLogoExample from '~/frontend/assets/manuLogoExample.png';

const Cars: NextPageWithLayout = () => {
  const manufacturerQuery = trpc.manufacturer.getAll.useQuery(undefined);

  return (
    <div>
      <Widget header="Manufacturers">
        <div className="flex justify-center flex-wrap">
          {manufacturerQuery.data?.map((manu, index) => (
            <Fragment key={index}>{manufacturer(manu.name)}</Fragment>
          ))}
        </div>
        {/* {manufacturerQuery.data?.map((manu, index) => (
          <Fragment key={index}>
            <Link href={`/cars/${manu.name}`}>
              <div>
                <b>{manu.name}</b>, {manu.yearFounded}, {manu.headquarters}
              </div>
            </Link>
          </Fragment>
        ))} */}
      </Widget>
    </div>
  );
};

/* interface Props {
  text: string;
} */

const manufacturer = (text: string) => {
  return (
    <Link
      href={`/cars/${text}`}
      className="text-white hover:text-slate-300 border border-transparent hover:border-white w-[31%] aspect-square min-w-[110px] min-h-[110px] max-w-[250px] max-h-[250px] bg-select-box flex pt-4 pb-2.5 justify-between items-center flex-col m-1 rounded-md"
    >
      <Image
        src={manuLogoExample}
        alt="Manufacturer Example Logo"
        className="h-7/12 w-7/12"
      />
      <div className="grow flex items-center">
        <p className="font-light m-auto">{text}</p>
      </div>
    </Link>
  );
};

export default Cars;

// Cars.isProtected = true;
