import { z } from 'zod';
import { carCategory, lobbyTags } from '@prisma/client';

export const lobbySettingsSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.nativeEnum(lobbyTags).array(),
  userId: z.string(),
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
      id: z.string(),
      name: z.string(),
      tuningSheetId: z.string().optional(),
      tuningSheetName: z.string().optional(),
    })
    .array(),
  maxPower: z.number().optional(),
  minimumWeight: z.number().optional(),
});

export type ILobbySettings = z.infer<typeof lobbySettingsSchema>;
