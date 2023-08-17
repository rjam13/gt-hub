import { router, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';
import { UploadStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

const defaultTuningSheetSelect = Prisma.validator<Prisma.TuningSheetSelect>()({
  id: true,
  author: true,
  authorId: true,
  car: true,
  carId: true,
  title: true,
  text: true,
  updatedAt: true,
  performancePoints: true,
});

export const tuningSheetRouter = router({
  byCarModel: publicProcedure
    .input(
      z.object({
        name: z.string(), // name of the car model e.g. "911 Turbo (930) '81"
      }),
    )
    .query(async ({ input, ctx }) => {
      const { name } = input;
      // looks for tuning sheets where it matches the car's name
      const tuningSheets = await ctx.prisma.tuningSheet.findMany({
        where: { car: { name: name } },
        select: defaultTuningSheetSelect,
      });
      return tuningSheets;
    }),

  byMultipleCarModel: publicProcedure
    .input(
      z.object({
        names: z.string().array(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { names } = input;
      // looks for tuning sheets where it matches the cars' name
      const tuningSheets = await ctx.prisma.tuningSheet.findMany({
        where: { car: { name: { in: names } } },
        select: defaultTuningSheetSelect,
      });
      return tuningSheets;
    }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      // looks for a specific tuning sheet using its id
      const tuningSheet = await ctx.prisma.tuningSheet.findUnique({
        where: { id: id },
        select: defaultTuningSheetSelect,
      });
      // const carModel = await ctx.prisma.carModel.findUnique({
      //   where: { id: tuningSheet?.carId },
      // });
      // const manufacturer = await ctx.prisma.manufacturer.findUnique({
      //   where: { id: carModel?.manufacturerId },
      // });
      return tuningSheet;
    }),

  add: protectedProcedure
    .input(
      z.object({
        authorId: z.string(),
        carId: z.string(),
        title: z.string().max(250),
        text: z.string().max(1000),
        status: z.nativeEnum(UploadStatus),
        performancePoints: z.custom<number>(
          (val) =>
            typeof val === 'number' &&
            Number(val.toFixed(2)) === val &&
            val < 1000,
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const tuningSheet = await ctx.prisma.tuningSheet.create({
        data: {
          ...input,
          heightFront: 0,
          heightRear: 0,
          rollBarFront: 0,
          rollBarRear: 0,
          compressionFront: 0,
          compressionRear: 0,
          expansionFront: 0,
          expansionRear: 0,
          initTorqueFront: 0,
          initTorqueRear: 0,
          accelSensFront: 0,
          accelSensRear: 0,
          brakingSensFront: 0,
          brakingSensRear: 0,
          naturalFreqFront: 0,
          naturalFreqRear: 0,
          camberFront: 0,
          camberRear: 0,
          toeFront: 0,
          toeRear: 0,
          frontRearDis: '0 : 100',
        },
      });
      return {
        status: 201,
        message: 'tuning sheet created successfully',
        result: tuningSheet.id,
      };
    }),
});
