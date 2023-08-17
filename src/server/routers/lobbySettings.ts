import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

// This file is for providing all the data/options in the "Create Lobby Settings" page.
// e.g. Tracks, tags, gr rating, etc..
// Cars and tuning sheets are in their own routers.

export const lobbySettingsRouter = router({
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
