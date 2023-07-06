import { z } from 'zod';
import { Prisma } from '@prisma/client';

// See the link below for the rationale behind this file
// https://github.com/trpc/trpc/discussions/2021#discussioncomment-4701955

export const checkCredentialsSchema = z.object({
  name: z.string(), // THERE SHOULD BE SOME CONSTRAINTS HERE
  password: z.string(), // THERE SHOULD BE SOME CONSTRAINTS HERE
});

export const userCreateSchema = z.object({
  email: z.string(), // THERE SHOULD BE SOME CONSTRAINTS HERE
  password: z.string(), // THERE SHOULD BE SOME CONSTRAINTS HERE
  name: z.string(), // THERE SHOULD BE SOME CONSTRAINTS HERE
});

export type ICheckCredentials = z.infer<typeof checkCredentialsSchema>;
export type IUserCreate = z.infer<typeof userCreateSchema>;

/**
 * Default selector for user.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  image: true,
  password: true,
  salt: true,
});
