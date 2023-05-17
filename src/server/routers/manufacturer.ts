import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
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
  },
);

export const manufacturerRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.manufacturer.findMany({
      select: defaultManufacturerSelect,
    });
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
