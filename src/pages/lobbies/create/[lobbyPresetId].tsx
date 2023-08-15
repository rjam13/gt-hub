import React, { Fragment, useEffect, useState } from 'react';
import Widget from '~/frontend/components/Widget';
import { trpc } from '~/utils/trpc';
import type { AppRouter } from '~/server/routers/_app';
import { inferProcedureInput } from '@trpc/server';
import { useRouter } from 'next/router';
import Button from '~/frontend/components/Button';
import MultipleModelSelect, {
  selectedModel,
} from '~/frontend/components/MultipleModelSelect';
import Modal from '~/frontend/Modal';

const CreateLobbySettings = () => {
  const router = useRouter();
  const slug = router.query.manufacturer?.[0];
  let lobbySetting = '';
  if (slug !== undefined) lobbySetting = slug;

  // Tracks which cars are allowed
  const [selectedModels, setSelectedModels] = useState<selectedModel[]>([]);
  // updates a specific selected model with a tuning sheet
  const updateSelectedModel = (
    index: number,
    property: { tuningSheetId: string; tuningSheetTitle: string },
  ) => {
    setSelectedModels(
      selectedModels.map((model, i) =>
        i === index ? { ...model, ...property } : { ...model },
      ),
    );
  };

  // Tracks if the "Choose Cars "modal is open
  const [modalModelSelect, setModalModelSelect] = useState(false);

  // tracks if tuning sheet modal is open of any car,
  // -1 == not open,
  // any other number == index of selectedModels
  const [currentModelIndex, setCurrentModelIndex] = useState(-1);

  const currentCarName = selectedModels[currentModelIndex]?.name ?? '';
  const { data, refetch } = trpc.tuningSheet.byCarModel.useQuery(
    {
      name: currentCarName,
    },
    { enabled: false },
  );
  // whenever currentModelIndex is changed, refetch data.
  useEffect(() => {
    if (currentModelIndex !== -1) refetch();
  }, [currentModelIndex, refetch]);

  return (
    <>
      <Modal
        open={modalModelSelect}
        onClose={() => {
          setModalModelSelect(false);
        }}
      >
        <MultipleModelSelect
          selectedModels={selectedModels}
          setSelectedModels={setSelectedModels}
        />
      </Modal>

      <Modal
        open={currentModelIndex != -1}
        onClose={() => {
          setCurrentModelIndex(-1);
        }}
      >
        {`${selectedModels[currentModelIndex]?.name} Tuning Sheets`}
        {data?.map((sheet, index) => {
          return (
            <div key={index}>
              <h2>{sheet.title}</h2>
              <p>
                <>{sheet.performancePoints}</>
              </p>
              <Button
                onClick={() => {
                  updateSelectedModel(currentModelIndex, {
                    tuningSheetId: sheet.id,
                    tuningSheetTitle: sheet.title,
                  });
                }}
                text="add"
              />
            </div>
          );
        })}
      </Modal>

      <div className="flex flex-col items-center">
        <Widget header="Create Lobby Settings" className="w-full">
          <div className="flex flex-col">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const $form = e.currentTarget;
                const values = Object.fromEntries(new FormData($form));
                console.log(values);
                console.log(selectedModels);
              }}
            >
              <label htmlFor="title">title:</label>
              <input id="title" name="title" type="text" />
              <br />
              <label htmlFor="description">description:</label>
              <input id="description" name="description" type="text" />
              <br />
              {/* TO DO: Choose cars here, there should be a modal that shows the manufacturer widget 
            and car model widget where a user is able to select and deselect cars */}
              <Button
                text="Choose Cars"
                onClick={() => {
                  setModalModelSelect(true);
                }}
              />
              {/* TO DO: Choose tuning sheets here, there should be a drop down for each car selected. 
            Each drop down should have all the tuning sheets of their car. Should be optional */}
              {selectedModels.map((model, index) => (
                <Fragment key={index}>
                  <div
                    onClick={() => {
                      setCurrentModelIndex(index);
                    }}
                  >
                    {model.name}
                  </div>
                </Fragment>
              ))}

              <label htmlFor="tracks">Choose Tracks:</label>
              <div className="text-black">
                <select name="tracks" multiple id="tracks">
                  <option value="spa">spa</option>
                  <option value="suzuka">suzuka</option>
                </select>
              </div>

              <h3>optional:</h3>
              <label htmlFor="tags">Choose Tags:</label>
              <div className="text-black">
                <select name="tags" multiple id="tags">
                  <option value="rain">rain</option>
                  <option value="streetTires">streetTires</option>
                </select>
              </div>

              <label htmlFor="grRating">gr rating:</label>
              <div className="text-black">
                <select name="grRating" multiple id="grRating">
                  <option value="gr1">gr1</option>
                  <option value="gr2">gr2</option>
                  <option value="gr3">gr3</option>
                  <option value="gr4">gr4</option>
                  <option value="grx">grx</option>
                  <option value="grb">grb</option>
                </select>
              </div>

              <br />
              <label htmlFor="ppRating">ppRating:</label>
              <input id="ppRating" name="ppRating" type="text" />

              <br />
              <label htmlFor="maxPower">maxPower:</label>
              <input id="maxPower" name="maxPower" type="text" />

              <br />
              <label htmlFor="minimumWeight">minimumWeight:</label>
              <input id="minimumWeight" name="minimumWeight" type="text" />

              <br />
              <h3>
                <label htmlFor="startTime">startTime:</label>
              </h3>
              <input id="startTime" name="startTime" type="datetime-local" />

              <br />
              <input type="submit" />
            </form>
          </div>
        </Widget>
      </div>
    </>
  );
};

export default CreateLobbySettings;
