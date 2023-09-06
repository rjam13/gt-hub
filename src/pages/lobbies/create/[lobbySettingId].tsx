import React, { Fragment, useEffect, useState } from 'react';
import Widget from '~/frontend/components/Widget';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Button from '~/frontend/components/Button';
import MultipleModelSelect, {
  selectedModel,
} from '~/frontend/components/MultipleModelSelect';
import Modal from '~/frontend/components/Modal';
import { lobbyTags, carCategory, TrackLayout } from '@prisma/client';
import {
  AsyncReturnType,
  camelCaseToWords,
  isObjectIncluded,
  getDirtyValues,
  isObjectIncludedUsingTwoCriterias,
} from '~/utils/misc';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  ICreateLobbySettings,
  createLobbySettingsSchema,
} from '~/schemas/lobbySchema';
import { getLobbySettings } from '~/server/routers/lobby';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { prisma } from '~/server/prisma';
import { useSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps<{
  defaultSettings?: AsyncReturnType<typeof getLobbySettings>;
}> = async (ctx) => {
  const lobbySettingId = ctx.params?.lobbySettingId as string;
  if (lobbySettingId !== 'new') {
    const defaultSettings = await getLobbySettings({
      prisma,
      id: lobbySettingId,
    });
    return defaultSettings ? { props: { defaultSettings } } : { props: {} };
  }
  return { props: {} };
};

let renderCount = 0;

const CreateLobbySettings = ({
  defaultSettings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(`render ${++renderCount}`);

  const { data: session } = useSession();

  const defaultModels: selectedModel[] =
    defaultSettings?.allowedCars?.map((car) => {
      return {
        carModelId: car.carModelId,
        carModelName: car.carModel.name,
        tuningSheetId: car.tuningSheetId ?? undefined,
        tuningSheetTitle: car.tuningSheet?.title,
      };
    }) ?? [];
  const defaultTracks = defaultSettings?.tracks ?? [];
  const defaultTags = defaultSettings?.tags ?? [];
  const defaultGRRating = defaultSettings?.grRating ?? [];
  const { register, setValue, handleSubmit, formState } =
    useForm<ICreateLobbySettings>({
      defaultValues: {
        title: defaultSettings?.title ?? undefined,
        description: defaultSettings?.description ?? undefined,
        ppRating: defaultSettings?.ppRating ?? undefined,
        maxPower: defaultSettings?.maxPower ?? undefined,
        minimumWeight: defaultSettings?.minimumWeight ?? undefined,
        allowedCars: defaultModels,
        tracks: defaultTracks,
        tags: defaultTags,
        grRating: defaultGRRating,
      },
      resolver: zodResolver(createLobbySettingsSchema),
    });
  // For pressing the "New" button. This action creates a new entry in the database
  const createSettings = trpc.lobby.createSettings.useMutation();
  const newSettings: SubmitHandler<ICreateLobbySettings> = async (values) => {
    try {
      await createSettings.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };
  // For pressing the "Save" button. This action updates the entry that corresponds to the id in defaultSettings.
  // Can be executed if defaultSettings exists (i.e. the id of the settings is in the url)
  // and that the name in creator in defaultSettings is equal to the current user's name
  const updateSettings = trpc.lobby.updateSettings.useMutation();
  const saveSettings: SubmitHandler<ICreateLobbySettings> = async (values) => {
    // ***** TODO *****
    // THIS SHOULD ONLY PASS TO CHANGED VALUES TO updateSettings.mutateAsync
    const dirtyValues = getDirtyValues(formState.dirtyFields, values);
    console.log(dirtyValues);
    try {
      if (typeof defaultSettings?.id != 'undefined')
        await updateSettings.mutateAsync({
          ...dirtyValues,
          id: defaultSettings?.id,
        });
    } catch (error) {
      console.error(error);
    }
  };

  // ========== CAR MODELS ==========
  // tracks which cars are allowed
  const [selectedModels, setSelectedModels] =
    useState<selectedModel[]>(defaultModels);
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
  useEffect(() => {
    setValue('allowedCars', selectedModels, { shouldDirty: true });
  }, [selectedModels, setValue]);
  // tracks if the "Choose Cars "modal is open
  const [modelSelectModal, setModelSelectModal] = useState(false);
  // Checks if the model is new to the exisiting list of cars, defaultModels.
  // if there is no defaultModels (i.e. an entirely new tuning sheet), this will always return true
  const isNewlySelectedModel = (carModelId: string) =>
    !isObjectIncluded<selectedModel>(defaultModels, carModelId, 'carModelId');
  // Checks if the tuning sheet of model is changed from the default.
  // e.g. This will return true if the pre-existing (from defaultModels) tuning sheet is removed
  const isTuningSheetChanged = (
    carModelId: string,
    tuningSheetId: string | undefined,
  ) => {
    return !isObjectIncludedUsingTwoCriterias<selectedModel>(
      defaultModels,
      tuningSheetId,
      'tuningSheetId',
      carModelId,
      'carModelId',
    );
  };

  // ========== SELECTED CAR MODEL TUNING SHEETS ==========
  // tracks if tuning sheet modal is open of any car,
  // -1 == not open,
  // any other number == index of selectedModels
  const [currentModelIndex, setCurrentModelIndex] = useState(-1);
  const currentModelName =
    selectedModels[currentModelIndex]?.carModelName ?? '';
  const { data: tuningSheets, refetch: refetchTuningSheets } =
    trpc.tuningSheet.byCarModel.useQuery(
      {
        name: currentModelName,
      },
      { enabled: false },
    );
  // whenever currentModelIndex is changed, refetch data (tuning sheets).
  useEffect(() => {
    if (currentModelIndex !== -1) refetchTuningSheets();
  }, [currentModelIndex, refetchTuningSheets]);

  // ========== TRACKS ==========
  const { data: tracks } = trpc.lobby.tracks.useQuery();
  const [selectedTrackLayouts, setSelectedTrackLayouts] =
    useState<TrackLayout[]>(defaultTracks);
  // Checks if track of name is inside selectedTrackLayouts
  const isTrackLayoutSelected = (name: string) =>
    isObjectIncluded<TrackLayout>(selectedTrackLayouts, name, 'name');
  useEffect(() => {
    setValue('tracks', selectedTrackLayouts, { shouldDirty: true });
  }, [selectedTrackLayouts, setValue]);

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
        {`${selectedModels[currentModelIndex]?.carModelName} Tuning Sheets`}
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
        {/* <pre>{JSON.stringify(formState, null, 2)}</pre> */}
        <Widget header="Create Lobby Settings" className="w-full">
          <div className="flex flex-col">
            <form>
              {/* ===== TITLE ===== */}
              <label
                className={formState.dirtyFields.title ? 'text-amber-300' : ''}
                htmlFor="title"
              >
                title:
              </label>
              <input id="title" type="text" {...register('title')} />
              <br />

              {/* ===== DESCRIPTION ===== */}
              <label
                htmlFor="description"
                className={
                  formState.dirtyFields.description ? 'text-amber-300' : ''
                }
              >
                description:
              </label>
              <input
                id="description"
                type="text"
                {...register('description')}
              />
              <br />

              {/* ===== CHOOSE CAR MODELS ===== */}
              <Button
                text="Choose Cars"
                className={
                  formState.dirtyFields.allowedCars ? 'text-amber-300' : ''
                }
                onClick={() => {
                  setModelSelectModal(true);
                }}
              />

              {/* ===== CAR MODELS SELECTED ===== */}
              {/* TO DO: Implement a better way of finding tuning sheets for a car */}
              {selectedModels.map((model, index) => (
                <Fragment key={index}>
                  <Button
                    className={
                      formState.dirtyFields.allowedCars &&
                      (isNewlySelectedModel(model.carModelId) ||
                        isTuningSheetChanged(
                          model.carModelId,
                          model.tuningSheetId,
                        ))
                        ? 'text-amber-300'
                        : ''
                    }
                    onClick={() => {
                      setCurrentModelIndex(index);
                    }}
                    text={model.carModelName}
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
              <legend
                className={formState.dirtyFields.tracks ? 'text-amber-300' : ''}
              >
                Choose Tracks:
              </legend>
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
                          checked={isTrackLayoutSelected(layout.name)}
                          onChange={() => {
                            return;
                          }}
                          onClick={() => {
                            if (isTrackLayoutSelected(layout.name)) {
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
              {/* TO DO: Make these fields actually optional as the form requires them to be filled before submitting */}
              {/* ===== TAGS ===== */}
              <legend
                className={formState.dirtyFields.tags ? 'text-amber-300' : ''}
              >
                Choose Tags:
              </legend>
              <div>
                {Object.keys(lobbyTags).map((v, index) => {
                  return (
                    <Fragment key={index}>
                      <input
                        id={v}
                        type="checkbox"
                        value={v}
                        {...register('tags')}
                      />
                      <label htmlFor={v}>{camelCaseToWords(v)}</label>
                      <br />
                    </Fragment>
                  );
                })}
              </div>

              {/* ===== GR RATING ===== */}
              <legend
                className={
                  formState.dirtyFields.grRating ? 'text-amber-300' : ''
                }
              >
                GR Rating:
              </legend>
              <div>
                {Object.keys(carCategory).map((value, index) => {
                  return (
                    <Fragment key={index}>
                      <input
                        id={value}
                        type="checkbox"
                        value={value}
                        {...register('grRating')}
                      />
                      <label htmlFor={value}>{camelCaseToWords(value)}</label>
                      <br />
                    </Fragment>
                  );
                })}
              </div>
              <br />

              {/* ===== PP RATING ===== */}
              <label
                htmlFor="ppRating"
                className={
                  formState.dirtyFields.ppRating ? 'text-amber-300' : ''
                }
              >
                ppRating:
              </label>
              <input
                id="ppRating"
                type="text"
                {...register('ppRating', { valueAsNumber: true })}
              />
              <br />

              {/* ===== MAX POWER ===== */}
              <label
                htmlFor="maxPower"
                className={
                  formState.dirtyFields.maxPower ? 'text-amber-300' : ''
                }
              >
                maxPower:
              </label>
              <input
                id="maxPower"
                type="text"
                {...register('maxPower', { valueAsNumber: true })}
              />
              <br />

              {/* ===== MINIMUM WEIGHT ===== */}
              <label
                htmlFor="minimumWeight"
                className={
                  formState.dirtyFields.minimumWeight ? 'text-amber-300' : ''
                }
              >
                minimumWeight:
              </label>
              <input
                id="minimumWeight"
                type="text"
                {...register('minimumWeight', { valueAsNumber: true })}
              />
              <br />

              {/* ===== START TIME ===== */}
              {/* This is not being passed to the backend at the moment */}
              {/* TO DO: Create actual lobbies using this */}
              {/* <h3>
                <label htmlFor="startTime">startTime:</label>
              </h3>
              <input id="startTime" name="startTime" type="datetime-local" /> */}

              <br />
              <Button text="New" onClick={handleSubmit(newSettings)} />

              {defaultSettings?.creator.name === session?.user?.name &&
                formState.isDirty && (
                  <Button text="Save" onClick={handleSubmit(saveSettings)} />
                )}
            </form>
          </div>
        </Widget>
      </div>
    </>
  );
};

export default CreateLobbySettings;

CreateLobbySettings.isProtected = true;
