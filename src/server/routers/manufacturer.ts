import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * Default selector for manufacturer.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

const defaultManufacturerSelect = Prisma.validator<Prisma.ManufacturerSelect>()(
  {
    id: true,
    name: true,
    yearFounded: true,
    headquarters: true,
    image: true,
    models: true,
  },
);

export const manufacturerRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.manufacturer.findMany({
      select: defaultManufacturerSelect,
    });
  }),

  byName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { name } = input;
      const manufacturer = await ctx.prisma.manufacturer.findUnique({
        where: { name: name },
        select: defaultManufacturerSelect,
      });
      if (!manufacturer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No manufacturer with name '${name}'`,
        });
      }
      return manufacturer;
    }),

  add: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(32),
        yearFounded: z.number().min(0).max(10000),
        headquarters: z.string().min(1).max(64),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const manufacturer = await ctx.prisma.manufacturer.create({
        data: input,
        select: defaultManufacturerSelect,
      });
      return manufacturer;
    }),
});
