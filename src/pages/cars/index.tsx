import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';
import { Fragment, useState } from 'react';
import Widget from '~/frontend/components/Widget';
import exampleModel from '~/frontend/assets/porsche_911_Turbo_(930)_81.png';
import ManufacturerCard from '~/frontend/components/ManufacturerCard';
import CarModelEntry from '~/frontend/components/CarModelEntry';

const Cars: NextPageWithLayout = () => {
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
                <ManufacturerCard
                  name={manu.name}
                  isSelected={manu.name === manuSelected}
                  onClick={() => {
                    setManuSelected(manu.name);
                  }}
                  image={manu.image != null ? manu.image : ''}
                />
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
                <CarModelEntry
                  name={model.name}
                  image={exampleModel}
                  href={`/${model.name}`}
                />
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