import { z } from 'zod';
import { carCategory, lobbyTags } from '@prisma/client';

export const createLobbySettingsSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.nativeEnum(lobbyTags).array(),
  ppRating: z.number().optional(),
  grRating: z.nativeEnum(carCategory).array(),
  tracks: z
    .object({
      id: z.string(),
      image: z.string().nullable(),
      name: z.string(),
      trackName: z.string(),
    })
    .array(),
  allowedCars: z
    .object({
      carModelId: z.string(),
      carModelName: z.string(),
      tuningSheetId: z.string().optional(),
      tuningSheetName: z.string().optional(),
    })
    .array(),
  maxPower: z.number().optional(),
  minimumWeight: z.number().optional(),
});

export type ICreateLobbySettings = z.infer<typeof createLobbySettingsSchema>;

export const getLobbySettingsInputSchema = z.object({
  id: z.string(),
});

export type IGetLobbySettings = z.infer<typeof getLobbySettingsInputSchema>;
