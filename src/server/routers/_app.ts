/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { manufacturerRouter } from './manufacturer';
import { postRouter } from './post';
import { userRouter } from './user';
import { tuningSheetRouter } from './tuningSheet';
import { lobbyRouter } from './lobby';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  post: postRouter,
  manufacturer: manufacturerRouter,
  user: userRouter,
  tuningSheet: tuningSheetRouter,
  lobby: lobbyRouter,
});

export type AppRouter = typeof appRouter;
