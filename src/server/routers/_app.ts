/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { manufacturerRouter } from './manufacturer';
import { postRouter } from './post';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  post: postRouter,
  manufacturer: manufacturerRouter,
});

export type AppRouter = typeof appRouter;
