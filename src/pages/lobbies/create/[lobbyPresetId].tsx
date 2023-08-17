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
import Modal from '~/frontend/components/Modal';
import { lobbyTags, carCategory, TrackLayout } from '@prisma/client';
import { isObjectIncluded } from '~/utils/misc';

const CreateLobbySettings = () => {
  const router = useRouter();
  const slug = router.query.manufacturer?.[0];
  let lobbySetting = '';
  if (slug !== undefined) lobbySetting = slug;

  // tracks which cars are allowed
  const [selectedModels, setSelectedModels] = useState<selectedModel[]>([]);
  // updates a specific selected model with a tuning sheet
  const updateSelectedModel = (
    index: number,
    property: {
      tuningSheetId: string | undefined;
      tuningSheetTitle: string | undefined;
    },
  ) => {
    setSelectedModels(
      selectedModels.map((model, i) =>
        i === index ? { ...model, ...property } : { ...model },
      ),
    );
  };
  // tracks if the "Choose Cars "modal is open
  const [modelSelectModal, setModelSelectModal] = useState(false);

  // tracks if tuning sheet modal is open of any car,
  // -1 == not open,
  // any other number == index of selectedModels
  const [currentModelIndex, setCurrentModelIndex] = useState(-1);
  const currentModelName = selectedModels[currentModelIndex]?.name ?? '';
  const { data: tuningSheets, refetch } = trpc.tuningSheet.byCarModel.useQuery(
    {
      name: currentModelName,
    },
    { enabled: false },
  );
  // whenever currentModelIndex is changed, refetch data.
  useEffect(() => {
    if (currentModelIndex !== -1) refetch();
  }, [currentModelIndex, refetch]);

  const { data: tracks } = trpc.lobbySettings.tracks.useQuery();
  const [selectedTrackLayouts, setSelectedTrackLayouts] = useState<
    TrackLayout[]
  >([]);
  // Checks if track of name is inside selectedTrackLayouts
  const isTrackLayoutSelected = (list: TrackLayout[], name: string) =>
    isObjectIncluded<TrackLayout>(list, name, 'name');

  return (
    <>
      {/* ===== modelSelectModal ===== */}
      <Modal
        open={modelSelectModal}
        onClose={() => {
          setModelSelectModal(false);
        }}
      >
        <MultipleModelSelect
          selectedModels={selectedModels}
          setSelectedModels={setSelectedModels}
        />
      </Modal>

      {/* ===== currentModelIndex Modal ===== */}
      <Modal
        open={currentModelIndex != -1}
        onClose={() => {
          setCurrentModelIndex(-1);
        }}
      >
        {`${selectedModels[currentModelIndex]?.name} Tuning Sheets`}
        {tuningSheets?.map((sheet, index) => {
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
                text={
                  selectedModels[currentModelIndex]?.tuningSheetId == sheet.id
                    ? 'successfully added'
                    : 'add'
                }
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
                console.log(selectedTrackLayouts);
              }}
            >
              {/* ===== TITLE ===== */}
              <label htmlFor="title">title:</label>
              <input id="title" name="title" type="text" />
              <br />

              {/* ===== DESCRIPTION ===== */}
              <label htmlFor="description">description:</label>
              <input id="description" name="description" type="text" />
              <br />

              {/* ===== CHOOSE CAR MODELS ===== */}
              <Button
                text="Choose Cars"
                onClick={() => {
                  setModelSelectModal(true);
                }}
              />

              {/* ===== CAR MODELS SELECTED ===== */}
              {/* TO DO: Implement a better way of finding tuning sheets for a car */}
              {selectedModels.map((model, index) => (
                <Fragment key={index}>
                  <Button
                    onClick={() => {
                      setCurrentModelIndex(index);
                    }}
                    text={model.name}
                  />
                  {model.tuningSheetId !== undefined && (
                    <div>
                      <span
                        onClick={() => {
                          updateSelectedModel(index, {
                            tuningSheetId: undefined,
                            tuningSheetTitle: undefined,
                          });
                        }}
                        className="text-red-600"
                      >
                        X
                      </span>
                      Tuning Sheet: {model.tuningSheetTitle}
                    </div>
                  )}
                </Fragment>
              ))}

              {/* ===== TRACK SELECTION ===== */}

              <legend>Choose Tracks:</legend>
              <div>
                {tracks?.map((track, index) => (
                  <Fragment key={index}>
                    <h4>{track.name}</h4>
                    {track.trackLayouts.map((layout, index) => (
                      <Fragment key={index}>
                        <input
                          id={layout.id}
                          type="checkbox"
                          name="tracks"
                          checked={isTrackLayoutSelected(
                            selectedTrackLayouts,
                            layout.name,
                          )}
                          onChange={() => {
                            return;
                          }}
                          onClick={() => {
                            if (
                              isTrackLayoutSelected(
                                selectedTrackLayouts,
                                layout.name,
                              )
                            ) {
                              setSelectedTrackLayouts((prevState) =>
                                prevState.filter(
                                  (item) => item.name !== layout.name,
                                ),
                              );
                            } else {
                              setSelectedTrackLayouts((prevState) => [
                                ...prevState,
                                layout,
                              ]);
                            }
                          }}
                        />
                        <label htmlFor={layout.id}>{layout.name}</label>
                        <br />
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </div>

              <h3>optional:</h3>
              {/* ===== TAGS ===== */}
              <label htmlFor="tags">Choose Tags:</label>
              <div className="text-black">
                <select name="tags" multiple id="tags">
                  {Object.entries(lobbyTags).map(([key, value], i) => (
                    <option key={i} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* ===== GR RATING ===== */}
              <label htmlFor="grRating">gr rating:</label>
              <div className="text-black">
                <select name="grRating" multiple id="grRating">
                  {Object.entries(carCategory).map(([key, value], i) => (
                    <option key={i} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <br />

              {/* ===== PP RATING ===== */}
              <label htmlFor="ppRating">ppRating:</label>
              <input id="ppRating" name="ppRating" type="text" />
              <br />

              {/* ===== MAX POWER ===== */}
              <label htmlFor="maxPower">maxPower:</label>
              <input id="maxPower" name="maxPower" type="text" />
              <br />

              {/* ===== MINIMUM WEIGHT ===== */}
              <label htmlFor="minimumWeight">minimumWeight:</label>
              <input id="minimumWeight" name="minimumWeight" type="text" />
              <br />

              {/* ===== START TIME ===== */}
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
