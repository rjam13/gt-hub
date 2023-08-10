import { trpc } from '~/utils/trpc';
import { Fragment, MouseEventHandler, useState } from 'react';
import Link from 'next/dist/client/link';
import Widget from '~/frontend/components/Widget';
import Image from 'next/image';
import exampleModel from '~/frontend/assets/porsche_911_Turbo_(930)_81.png';
import { CldImage } from 'next-cloudinary';

interface Props {
  onClickCarModel?: MouseEventHandler<HTMLDivElement>;
}

const CarSelect = ({ onClickCarModel }: Props) => {
  const [manuSelected, setManuSelected] = useState('');

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
                <div
                  className={`text-white hover:text-slate-300 border border-transparent hover:border-white w-[31%] aspect-square min-w-[110px] min-h-[110px] max-w-[250px] max-h-[250px] bg-card pt-4 pb-2.5 m-1 rounded-md grid grid-rows-[66%_33%] ${
                    manu.name === manuSelected && 'text-slate-300 border-white'
                  }
                  `}
                  onClick={() => {
                    setManuSelected(manu.name);
                  }}
                >
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
                </div>
              </Fragment>
            ))}
          </div>
        </Widget>
      </div>

      {data.map((manu, index) => (
        <div
          key={index}
          className={`w-full md:w-auto md:basis-1/2 ${
            manu.name == manuSelected ? 'block' : 'hidden'
          }`}
        >
          <Widget header={manu.name ?? ''} className="relative">
            <div
              className="absolute right-0 top-0"
              onClick={() => {
                setManuSelected('');
              }}
            >
              Exit
            </div>
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

export default CarSelect;
