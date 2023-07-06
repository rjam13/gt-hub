import { router, publicProcedure } from '../trpc';
import { logger } from '~/utils/logger';
import { userCreateSchema } from '~/schemas/userSchema';
import { comparePassword, newPassword } from '~/utils/user';
import * as trpc from '@trpc/server';

export const userRouter = router({
  create: publicProcedure
    .input(userCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;
      // checking for duplicates
      const emailExists = await ctx.prisma.user.findFirst({
        where: { email },
      });
      const nameExists = await ctx.prisma.user.findFirst({
        where: { name },
      });
      if (emailExists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: 'User with that email already exists.',
        });
      }
      if (nameExists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: 'User already exists.',
        });
      }
      const security = newPassword(password);
      const userData = {
        ...input,
        salt: security.salt,
        password: security.passwordHash,
      };
      logger.debug('creating user', userData);
      const user = await ctx.prisma.user.create({
        data: userData,
      });
      return {
        status: 201,
        message: 'Account created successfully',
        result: user.email,
      };
    }),
  // Below is not used anymore as user validation is
  // done in the authorize function in [...nextauth].ts.
  // This is still here in case a better solution is found involving trpc.
  // checkCredentials: publicProcedure
  //   .input(checkCredentialsSchema)
  //   .query(async ({ input }) => {
  //     const user = await prisma.user.findUnique({
  //       where: { name: input.name },
  //       select: defaultUserSelect,
  //     });
  //     if (user && user.password == hashPassword(input.password)) {
  //       logger.debug('password correct');
  //       return omit(user, 'password');
  //     } else {
  //       logger.debug('incorrect credentials');
  //       throw new TRPCError({
  //         code: 'NOT_FOUND',
  //         message: `No user with name '${input.name}'`,
  //       });
  //     }
  //   }),
});
