import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { logger } from '../../../utils/logger';
import { prisma } from '~/server/prisma';
import { createUsername } from '~/utils/user';
import {
  checkCredentialsSchema,
  defaultUserSelect,
} from '~/schemas/userSchema';
import { hashPassword } from '~/utils/user';
import { omit } from 'lodash';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'jsmith',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        try {
          const { name, password } = await checkCredentialsSchema.parseAsync(
            credentials,
          );
          const user = await prisma.user.findUnique({
            where: { name: name },
            select: defaultUserSelect,
          });
          if (user && user.password == hashPassword(password)) {
            logger.debug('password correct');
            return omit(user, 'password');
          } else {
            logger.debug('incorrect credentials');
            return null;
          }
        } catch {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile: async (profile) => {
        return {
          id: profile.sub,
          name: createUsername(),
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error: (code, metadata) => {
      logger.error(code, metadata);
    },
    warn: (code) => {
      logger.warn(code);
    },
    debug: (code, metadata) => {
      logger.debug(code, metadata);
    },
  },
  // session
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // callbacks
  callbacks: {
    /**
     * @param  {string} url      URL provided as callback URL by the client
     * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
     * @return {string}          URL the client will be redirect to
     */
    redirect: async ({ url, baseUrl }): Promise<any> => {
      logger.debug(`url, baseUrl`, url, baseUrl);
      const params = new URLSearchParams(new URL(url).search);
      const callbackUrl = params.get('callbackUrl');
      if (url.startsWith(baseUrl)) {
        if (callbackUrl?.startsWith('/')) {
          logger.debug('redirecting to', baseUrl + callbackUrl);
          return baseUrl + callbackUrl;
        } else if (callbackUrl?.startsWith(baseUrl)) {
          logger.debug('redirecting to', callbackUrl);
          return callbackUrl;
        }
      } else {
        logger.debug('redirecting to', baseUrl);
        return Promise.resolve(baseUrl);
      }
      return Promise.resolve(url.startsWith(baseUrl) ? url : baseUrl);
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        return { ...session, id: token.id };
      }
      return session;
    },
    //   signIn: async ({
    //     user,
    //     account,
    //     profile,
    //     email,
    //     credentials,
    //   }) => {
    //     logger.debug(`signIn:user`, user, "\n\n");
    //     logger.debug(`signIn:account`, account, "\n\n");
    //     logger.debug(`signIn:profile`, profile, "\n\n");
    //     return true;
    //   },
    // // Getting the JWT token from API response
    // jwt: async ({ token, user, account }) => {
    //   logger.debug(`jwt:token`, token, '\n\n');
    //   logger.debug(`jwt:user`, user, '\n\n');
    //   logger.debug(`jwt:account`, account, '\n\n');
    //   const isSigningIn = user ? true : false;
    //   if (isSigningIn) {
    //     token.jwt = user.access_token;
    //     token.user = user;
    //   } else {
    //     logger.debug(`jwt:isSignIn: user is not logged in`, '\n\n');
    //   }
    //   logger.debug(`resolving token`, token, '\n\n');
    //   return Promise.resolve(token);
    // },
    // session: async ({ session, token }) => {
    //   logger.debug(`session:session`, session, '\n\n');
    //   logger.debug(`session:token`, token, '\n\n');
    //   session.jwt = token.jwt;
    //   session.user = token.user;
    //   logger.debug(`resolving session`, session, '\n\n');
    //   return Promise.resolve(session);
    // },
  },
};
export default NextAuth(authOptions);
