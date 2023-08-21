import { router, publicProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { lobbySettingsSchema } from '~/schemas/lobbySchema';
import { prisma } from '~/server/prisma';

// This file is for providing all the data/options in the "Create Lobby Settings" page.
// e.g. Tracks, tags, gr rating, etc..
// Cars and tuning sheets are in their own routers.

export const lobbyRouter = router({
  createSettings: protectedProcedure
    .input(lobbySettingsSchema)
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
