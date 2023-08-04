import { NextPageWithLayout } from './_app';
import Image from 'next/image';
import hero from '~/frontend/assets/hero.jpg';
import Button from '~/frontend/components/Button';

import { useSession, signIn, signOut } from 'next-auth/react';
import { signUp } from '~/utils/user';
import Widget from '~/frontend/components/Widget';
import Navbar from '~/frontend/components/Navbar';
import Footer from '~/frontend/components/Footer';
import { ReactElement } from 'react';
import LobbyCard from '~/frontend/components/LobbyCard';

const IndexPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <>
      {/* Hero */}
      <div className="h-screen relative mb-8">
        <Image src={hero} alt="hero image" className="h-full object-cover" />
        <div className="absolute h-screen top-0 left-0 right-0 bg-hero-gradient" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 max-w-screen sm:max-w-[380px] flex flex-col">
          <div className="bg-black/60 px-[15px] py-[30px] ">
            <p className="text-xl p-0">GT Hub</p>
            <p className="text-xl p-0">
              Scheduled lobbies, and tuning sheets for the community, by the
              community
            </p>
          </div>
          <div className="mt-[15px] flex justify-center">
            <Button text="Lobbies" href="/" />
            <Button text="Tuning Sheets" href="cars" />
          </div>
        </div>
      </div>

      {/* Widgets */}
      <div className="flex flex-col items-center">
        <Widget
          header="About"
          text="The mission of this website is to provide the Gran Turismo community
          more ways of using their cars against other drivers in fun curated
          races."
        />
        <Widget
          header="Lobbies"
          text="Here are some lobbies starting soon. Check out the lobby page to start your own or use filters to find the perfect race for you!"
          href="cars"
        >
          <LobbyCard />
          <LobbyCard />
          <LobbyCard />
        </Widget>

        {session ? (
          <>
            Signed in as {session?.user?.name} <br />
            <button className="btn" onClick={() => signOut()}>
              Sign out
            </button>
          </>
        ) : (
          <>
            Not signed in <br />
            <button className="btn" onClick={() => signIn()}>
              Sign in
            </button>
            <button className="btn" onClick={() => signUp()}>
              Sign up
            </button>
          </>
        )}
      </div>
    </>
  );
};

IndexPage.getLayout = function getLayout(component: ReactElement) {
  return (
    <>
      <Navbar absolute={true} />
      {component}
      <Footer />
    </>
  );
};

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
