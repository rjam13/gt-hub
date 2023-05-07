import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import sha256 from 'crypto-js/sha256';
import { logger } from '~/utils/logger';
import { omit } from 'lodash';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  image: true,
  password: true,
});

export const userRouter = router({
  checkCredentials: publicProcedure
    .input(
      z.object({
        username: z.string(), // THERE SHOULD BE SOME MIN AND MAX CONSTRAINTS HERE
        password: z.string(), // THERE SHOULD BE SOME MIN AND MAX CONSTRAINTS HERE
      }),
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { name: input.username },
        select: defaultUserSelect,
      });
      if (user && user.password == sha256(input.password).toString()) {
        logger.debug('password correct');
        return omit(user, 'password');
      } else {
        logger.debug('incorrect credentials');
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with username '${input.username}'`,
        });
      }
    }),
});
