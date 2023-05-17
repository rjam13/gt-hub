/* eslint-disable @typescript-eslint/no-unused-vars */
import type { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession, type Session } from 'next-auth';
import { prisma } from './prisma';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateInnerContextOptions) {
  return {
    prisma,
    session: _opts.session,
  };
}

export type Context = inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: CreateNextContextOptions) {
  // for API-response caching see https://trpc.io/docs/caching
  const session = await getServerSession(opts.req, opts.res, authOptions);
  const contextInner = await createContextInner({ session });

  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
}
