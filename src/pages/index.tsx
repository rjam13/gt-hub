import { NextPageWithLayout } from './_app';
import Link from 'next/link';

import { useSession, signIn, signOut } from 'next-auth/react';

const IndexPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  // console.log(session);

  return (
    <>
      {session ? (
        <>
          Signed in as {session?.user?.name} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
          <button
            onClick={() => {
              const callbackUrl = window.location.href;
              window.location.href = `/auth/signup?${new URLSearchParams({
                callbackUrl,
              })}`;
            }}
          >
            Sign up
          </button>
        </>
      )}
      <br />
      <Link href={`/cars`}>View Cars</Link>
    </>
  );
};

// IndexPage.getLayout = function getLayout(component: ReactElement) {
//   return (
//     <>
//       <h1>index page h1 tag</h1>
//       {component}
//     </>
//   );
// };

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createServerSideHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
