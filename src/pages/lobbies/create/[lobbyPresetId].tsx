import React, { useState } from 'react';
import Widget from '~/frontend/components/Widget';
import { trpc } from '~/utils/trpc';
import type { AppRouter } from '~/server/routers/_app';
import { inferProcedureInput } from '@trpc/server';
import { useRouter } from 'next/router';
import Button from '~/frontend/components/Button';
import CarSelect from '~/frontend/components/MultipleCarSelect';

const CreateLobbySettings = () => {
  const router = useRouter();
  const slug = router.query.manufacturer?.[0];
  let lobbySetting = '';
  if (slug !== undefined) lobbySetting = slug;

  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const [modal, setModal] = useState(false);
  console.log(modal);

  // const manufacturerQuery = trpc.manufacturer.getAll.useQuery(undefined);

  // if (manufacturerQuery.status !== 'success') {
  //   return <>Loading...</>;
  // }

  // const { data } = manufacturerQuery;
  // const addManufacturer = trpc.manufacturer.add.useMutation({});

  return (
    <>
      {modal && (
        <>
          <div
            className="fixed z-[900] bg-black/[0.6] w-screen h-screen top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 "
            onClick={() => {
              setModal(false);
            }}
          />
          <div className="fixed z-[1000] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-screen">
            <CarSelect
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
            />
          </div>
          {/* <div className="myModal">
            <img
              onClick={() => {
                setIsOpen(false);
              }}
              tabIndex={0}
              className="myModalXIcon"
              src={xicon}
              alt="X button to go back"
            />
            <h3>Joining Game</h3>
            {data[gameSelected.index]}
            <div className="myModalSection">
              <SelectCharacter
                selectedCO={selectedCO}
                setSelectedCO={setSelectedCO}
              />
            </div>
            <button
              className="btn"
              style={{ width: '200px', 'font-size': '24px' }}
              onClick={() => {
                const data = {
                  gameId: gameSelected.gameId,
                  selectedCO: selectedCO,
                };
                axios.post('/joinGame', data, null).then((res) => {
                  console.log(res);
                  navigate('/currentgames');
                });
              }}
            >
              Join
            </button>
          </div> */}
        </>
      )}
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
                // type Input = inferProcedureInput<
                //   AppRouter['manufacturer']['add']
                // >;
                // const input: Input = {
                //   name: values.manufacturer as string,
                //   yearFounded: Number(values.yearFounded) as number,
                //   headquarters: values.headquarters as string,
                // };
                // try {
                //   await addManufacturer.mutateAsync(input);
                //   $form.reset();
                // } catch (cause) {
                //   console.error({ cause }, 'Failed to add manufacturer');
                // }
              }}
            >
              <label htmlFor="title">title:</label>
              <input
                id="title"
                name="title"
                type="text"
                // disabled={addManufacturer.isLoading}
              />
              <br />
              <label htmlFor="description">description:</label>
              <input
                id="description"
                name="description"
                type="text"
                // disabled={addManufacturer.isLoading}
              />
              <br />

              {/* TO DO: Choose cars here, there should be a modal that shows the manufacturer widget 
            and car model widget where a user is able to select and deselect cars */}
              <Button
                text="Choose Cars"
                onClick={() => {
                  setModal(true);
                }}
              />
              {/* TO DO: Choose tuning sheets here, there should be a drop down for each car selected. 
            Each drop down should have all the tuning sheets of their car. Should be optional */}

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
              <input
                id="ppRating"
                name="ppRating"
                type="text"
                // disabled={addManufacturer.isLoading}
              />
              <br />
              <label htmlFor="maxPower">maxPower:</label>
              <input
                id="maxPower"
                name="maxPower"
                type="text"
                // disabled={addManufacturer.isLoading}
              />
              <br />
              <label htmlFor="minimumWeight">minimumWeight:</label>
              <input
                id="minimumWeight"
                name="minimumWeight"
                type="text"
                // disabled={addManufacturer.isLoading}
              />
              <br />

              <h3>
                <label htmlFor="startTime">startTime:</label>
              </h3>
              <input
                id="startTime"
                name="startTime"
                type="datetime-local"
                // disabled={addManufacturer.isLoading}
              />
              <br />
              <input
                type="submit"
                // disabled={addManufacturer.isLoading}
              />
              {/* {addManufacturer.error && (
              <p style={{ color: 'red' }}>{addManufacturer.error.message}</p>
            )} */}
            </form>
          </div>
        </Widget>
      </div>
    </>
  );
};

export default CreateLobbySettings;
