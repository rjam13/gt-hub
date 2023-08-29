import React, { Fragment, useEffect, useState } from 'react';
import Widget from '~/frontend/components/Widget';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import Button from '~/frontend/components/Button';
import MultipleModelSelect, {
  selectedModel,
} from '~/frontend/components/MultipleModelSelect';
import Modal from '~/frontend/components/Modal';
import {
  lobbyTags,
  carCategory,
  TrackLayout,
  LobbySettings,
} from '@prisma/client';
import {
  AsyncReturnType,
  camelCaseToWords,
  isObjectIncluded,
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

const CreateLobbySettings = ({
  defaultSettings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(defaultSettings);

  const { register, setValue, handleSubmit } = useForm<ICreateLobbySettings>({
    defaultValues: {
      title: defaultSettings?.title ?? undefined,
      description: defaultSettings?.description ?? undefined,
      ppRating: defaultSettings?.ppRating ?? undefined,
      maxPower: defaultSettings?.maxPower ?? undefined,
      minimumWeight: defaultSettings?.minimumWeight ?? undefined,
    },
    resolver: zodResolver(createLobbySettingsSchema),
  });
  const submitSettings = trpc.lobby.createSettings.useMutation();
  const onSubmit: SubmitHandler<ICreateLobbySettings> = async (values) => {
    console.log(values);
    try {
      await submitSettings.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };

  // ========== CAR MODELS ==========
  const defaultModels: selectedModel[] =
    defaultSettings?.allowedCars?.map((car) => {
      return {
        carModelId: car.carModelId,
        carModelName: car.carModel.name,
        tuningSheetId: car.tuningSheetId ?? undefined,
        tuningSheetTitle: car.tuningSheet?.title,
      };
    }) ?? [];
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
    setValue('allowedCars', selectedModels);
  }, [selectedModels, setValue]);
  // tracks if the "Choose Cars "modal is open
  const [modelSelectModal, setModelSelectModal] = useState(false);

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
  const [selectedTrackLayouts, setSelectedTrackLayouts] = useState<
    TrackLayout[]
  >(defaultSettings?.tracks ?? []);
  // Checks if track of name is inside selectedTrackLayouts
  const isTrackLayoutSelected = (list: TrackLayout[], name: string) =>
    isObjectIncluded<TrackLayout>(list, name, 'name');
  useEffect(() => {
    setValue('tracks', selectedTrackLayouts);
  }, [selectedTrackLayouts, setValue]);

  // ========== TAGS ==========
  const [tags, setTags] = useState<lobbyTags[]>(defaultSettings?.tags ?? []);
  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);
  // ========== GR RATING ==========
  const [grRating, setGRRating] = useState<carCategory[]>(
    defaultSettings?.grRating ?? [],
  );
  useEffect(() => {
    setValue('grRating', grRating);
  }, [grRating, setValue]);

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
        <Widget header="Create Lobby Settings" className="w-full">
          <div className="flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ===== TITLE ===== */}
              <label htmlFor="title">title:</label>
              <input id="title" type="text" {...register('title')} />
              <br />

              {/* ===== DESCRIPTION ===== */}
              <label htmlFor="description">description:</label>
              <input
                id="description"
                type="text"
                {...register('description')}
              />
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
              <legend>Choose Tags:</legend>
              <div>
                {Object.keys(lobbyTags).map((v, index) => {
                  const value: (typeof tags)[number] =
                    v as (typeof tags)[number];
                  return (
                    <Fragment key={index}>
                      <input
                        id={value}
                        type="checkbox"
                        name="tags"
                        checked={tags.includes(value)}
                        onChange={() => {
                          return;
                        }}
                        onClick={() => {
                          if (tags.includes(value)) {
                            setTags((prevState) =>
                              prevState.filter((e) => e !== value),
                            );
                          } else {
                            setTags((prevState) => [...prevState, value]);
                          }
                        }}
                      />
                      <label htmlFor={value}>{camelCaseToWords(value)}</label>
                      <br />
                    </Fragment>
                  );
                })}
              </div>

              {/* ===== GR RATING ===== */}
              <legend>GR Rating:</legend>
              <div>
                {Object.keys(carCategory).map((v, index) => {
                  const value: (typeof grRating)[number] =
                    v as (typeof grRating)[number];
                  return (
                    <Fragment key={index}>
                      <input
                        id={value}
                        type="checkbox"
                        name="grRating"
                        checked={grRating.includes(value)}
                        onChange={() => {
                          return;
                        }}
                        onClick={() => {
                          if (grRating.includes(value)) {
                            setGRRating((prevState) =>
                              prevState.filter((e) => e !== value),
                            );
                          } else {
                            setGRRating((prevState) => [...prevState, value]);
                          }
                        }}
                      />
                      <label htmlFor={value}>{camelCaseToWords(value)}</label>
                      <br />
                    </Fragment>
                  );
                })}
              </div>
              <br />

              {/* ===== PP RATING ===== */}
              <label htmlFor="ppRating">ppRating:</label>
              <input
                id="ppRating"
                type="text"
                {...register('ppRating', { valueAsNumber: true })}
              />
              <br />

              {/* ===== MAX POWER ===== */}
              <label htmlFor="maxPower">maxPower:</label>
              <input
                id="maxPower"
                type="text"
                {...register('maxPower', { valueAsNumber: true })}
              />
              <br />

              {/* ===== MINIMUM WEIGHT ===== */}
              <label htmlFor="minimumWeight">minimumWeight:</label>
              <input
                id="minimumWeight"
                type="text"
                {...register('minimumWeight', { valueAsNumber: true })}
              />
              <br />

              {/* ===== START TIME ===== */}
              {/* This is not being passed to the backend at the moment */}
              {/* This page is for now a create lobby settings page rather than lobbies themselves */}
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

CreateLobbySettings.isProtected = true;
