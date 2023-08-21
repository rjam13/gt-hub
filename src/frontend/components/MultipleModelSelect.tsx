import { trpc } from '~/utils/trpc';
import { Fragment, useState } from 'react';
import Widget from '~/frontend/components/Widget';
import exampleModel from '~/frontend/assets/porsche_911_Turbo_(930)_81.png';
import ManufacturerCard from './ManufacturerCard';
import CarModelEntry from './CarModelEntry';
import { isObjectIncluded } from '~/utils/misc';

export interface selectedModel {
  carModelId: string;
  carModelName: string;
  tuningSheetId?: string;
  tuningSheetTitle?: string;
}

interface Props {
  // useState selectedModel[] state and setState function
  selectedModels: selectedModel[];
  setSelectedModels: React.Dispatch<React.SetStateAction<selectedModel[]>>;
}

// Note: this component is coupled with src/pages/lobbies/create/[lobbyPresetId].tsx, mainly due to selectedModel.
const MultipleModelSelect = ({ selectedModels, setSelectedModels }: Props) => {
  const [manuSelected, setManuSelected] = useState('');

  // Checks if an object with certain name is inside selectedModel[]
  const isSelected = (list: selectedModel[], name: string) =>
    isObjectIncluded<selectedModel>(list, name, 'carModelName');

  const manufacturerQuery = trpc.manufacturer.getAll.useQuery(undefined);
  if (manufacturerQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = manufacturerQuery;

  return (
    <div className="flex items-start justify-center flex-col md:flex-row max-w-screen-xl">
      <Widget
        header="Manufacturers"
        className={'' == manuSelected ? 'md:w-full' : `md:w-1/2`}
      >
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

      {data.map((manu, index) => (
        <div
          key={index}
          className={`w-full md:w-1/2 ${
            manu.name == manuSelected ? 'block' : 'hidden'
          }`}
        >
          <Widget
            header={manu.name ?? ''}
            onClose={() => {
              setManuSelected('');
            }}
          >
            {manu.models.map((model, index) => (
              <Fragment key={index}>
                <CarModelEntry
                  name={model.name}
                  image={exampleModel}
                  isSelected={isSelected(selectedModels, model.name)}
                  onClick={() => {
                    // remove and add model in selectedModels
                    if (isSelected(selectedModels, model.name)) {
                      setSelectedModels((prevState) =>
                        prevState.filter(
                          (item) => item.carModelId !== model.id,
                        ),
                      );
                    } else {
                      setSelectedModels((prevState) => [
                        ...prevState,
                        {
                          carModelId: model.id,
                          carModelName: model.name,
                          tuningSheetId: undefined,
                          tuningSheetTitle: undefined,
                        },
                      ]);
                    }
                  }}
                />
              </Fragment>
            ))}
          </Widget>
        </div>
      ))}
    </div>
  );
};

export default MultipleModelSelect;
