import { router, publicProcedure, protectedProcedure } from '../trpc';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  createLobbySettingsSchema,
  updateLobbySettingsSchema,
} from '~/schemas/lobbySchema';
import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

// This file is for providing all the data/options in the "Create Lobby Settings" page.
// e.g. Tracks, tags, gr rating, etc..
// Cars and tuning sheets are in their own routers.
const defaultLobbySettingsSelect =
  Prisma.validator<Prisma.LobbySettingsSelect>()({
    id: true,
    createdAt: true,
    title: true,
    description: true,
    tags: true,
    creator: { select: { name: true } },
    tracks: true,
    allowedCars: {
      include: {
        carModel: { select: { id: true, name: true } },
        tuningSheet: { select: { id: true, title: true } },
      },
    },
    ppRating: true,
    grRating: true,
    maxPower: true,
    minimumWeight: true,
  });

export async function getLobbySettings({
  prisma,
  id,
}: {
  prisma: PrismaClient;
  id: string;
}) {
  const { createdAt, ...lobbySettingsSelect } = defaultLobbySettingsSelect;
  const settings = await prisma.lobbySettings.findUnique({
    where: { id },
    select: lobbySettingsSelect,
  });
  if (!settings) {
    // throw new TRPCError({
    //   code: 'NOT_FOUND',
    //   message: `No lobby settings with id '${id}'`,
    // });
    return;
  }
  return settings;
}

export const lobbyRouter = router({
  // // currently not used
  // getLobbySettings: protectedProcedure
  //   .input(getLobbySettingsInputSchema)
  //   .query(async ({ input, ctx }) => {
  //     return getLobbySetting({ prisma: ctx.prisma, id: input.id });
  //   }),
  listLobbySettings: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.prisma.lobbySettings.findMany({
        select: defaultLobbySettingsSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items,
        nextCursor,
      };
    }),
  createSettings: protectedProcedure
    .input(createLobbySettingsSchema)
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const LobbySettings = await ctx.prisma.lobbySettings.create({
        data: {
          ...input,
          creator: { connect: { id: ctx.session.user.userId } },
          tracks: {
            connect: input.tracks,
          },
          allowedCars: {
            create: input.allowedCars.map(({ tuningSheetId, carModelId }) => {
              return {
                carModelId: carModelId,
                tuningSheetId: tuningSheetId,
              };
            }),
          },
        },
      });
      return {
        status: 201,
        message: 'Lobby Settings created successfully',
        result: LobbySettings.id,
      };
    }),
  updateSettings: protectedProcedure
    .input(updateLobbySettingsSchema)
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      // ***** TODO *****
      // THE LOBBY SETTINGS SHOULD ONLY UPDATE THE VALUES THAT HAVE CHANGED
      // This should help: https://stackoverflow.com/a/69529379
      const LobbySettings = await ctx.prisma.lobbySettings.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          tags: input.tags,
          ppRating: input.ppRating,
          grRating: input.grRating,
          maxPower: input.maxPower,
          minimumWeight: input.minimumWeight,
          tracks: {
            set: [],
            connect: input.tracks,
          },
          allowedCars: {
            deleteMany: {},
            createMany: {
              data:
                input.allowedCars?.map(({ tuningSheetId, carModelId }) => {
                  return {
                    carModelId: carModelId,
                    tuningSheetId: tuningSheetId,
                  };
                }) ?? [],
            },
          },
        },
      });
      return {
        status: 204,
        message: `Lobby Setting ${LobbySettings.id} updated successfully`,
        result: LobbySettings.id,
      };
    }),
  tracks: publicProcedure.query(async () => {
    const tracks = await prisma.track.findMany({
      select: Prisma.validator<Prisma.TrackSelect>()({
        name: true,
        image: true,
        location: true,
        trackLayouts: true,
      }),
      // get an extra item at the end which we'll use as next cursor
      where: {},
      orderBy: {
        name: 'asc',
      },
    });

    return tracks;
  }),
});
