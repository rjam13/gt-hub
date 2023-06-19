import { router, publicProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const tuningSheetRouter = router({
  byCarModel: protectedProcedure
    .input(
      z.object({
        name: z.string(), // name of the car model e.g. "911 Turbo (930) '81"
      }),
    )
    .query(async ({ input, ctx }) => {
      const { name } = input;
      // looks for tuning sheets where it matches the car's name
      const tuningSheets = await ctx.prisma.tuningSheet.findMany({
        where: { car: { name: name } }, // looks for tun
      });
      return tuningSheets;
    }),
});
