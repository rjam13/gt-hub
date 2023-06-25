import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { DefaultLayout } from '~/frontend/components/DefaultLayout';
import { trpc } from '~/utils/trpc';
import '../frontend/styles/global.scss';

import { SessionProvider } from 'next-auth/react';
import ProtectedPage from './protectedPage';

// explanation of this file:
// https://www.learnbestcoding.com/post/33/nextjs-template-layout

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement, pageProps?: AppProps) => ReactNode;
  isProtected?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  // if a page has a specifc layout, use that one instead of the default one.
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);
  // if the page is protected, wrap it with protectedPage component so that users must be logged in.
  const isProtected = Component.isProtected;

  return (
    <SessionProvider session={session}>
      {isProtected ? (
        <ProtectedPage>{getLayout(<Component {...pageProps} />)}</ProtectedPage>
      ) : (
        getLayout(<Component {...pageProps} />)
      )}
    </SessionProvider>
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
