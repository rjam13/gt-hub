import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { inferProcedureInput } from '@trpc/server';
import Link from 'next/link';
import {
  Fragment,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from 'react';
import type { AppRouter } from '~/server/routers/_app';

import { useSession, signIn, signOut } from 'next-auth/react';
import { apiBaseUrl } from 'next-auth/client/_utils';

const IndexPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  console.log(session);

  const utils = trpc.useContext();
  const postsQuery = trpc.post.list.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getPreviousPageParam(lastPage: { items: any; nextCursor: any }) {
        return lastPage.nextCursor;
      },
    },
  );
  const manufacturerQuery = trpc.manufacturer.getAll.useQuery(undefined);
  console.log(manufacturerQuery.data);

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate();
    },
  });
  const addManufacturer = trpc.manufacturer.add.useMutation({
    onSuccess: () => {
      void manufacturerQuery.refetch();
    },
  });

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);

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

      <h1>Welcome to your tRPC starter!</h1>
      <p>
        If you get stuck, check <a href="https://trpc.io">the docs</a>, write a
        message in our <a href="https://trpc.io/discord">Discord-channel</a>, or
        write a message in{' '}
        <a href="https://github.com/trpc/trpc/discussions">
          GitHub Discussions
        </a>
        .
      </p>
      <h2>
        Latest Posts
        {postsQuery.status === 'loading' && '(loading)'}
      </h2>
      <button
        onClick={() => postsQuery.fetchPreviousPage()}
        disabled={
          !postsQuery.hasPreviousPage || postsQuery.isFetchingPreviousPage
        }
      >
        {postsQuery.isFetchingPreviousPage
          ? 'Loading more...'
          : postsQuery.hasPreviousPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
      {postsQuery.data?.pages.map((page, index) => (
        <Fragment key={page.items[0]?.id || index}>
          {page.items.map(
            (item: {
              id: Key | null | undefined;
              title:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
            }) => (
              <article key={item.id}>
                <h3>{item.title}</h3>
                <Link href={`/post/${item.id}`}>View more</Link>
              </article>
            ),
          )}
        </Fragment>
      ))}
      <hr />
      <h3>Add a Post</h3>
      <form
        onSubmit={async (e) => {
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @see https://react-hook-form.com/
           * @see https://kitchen-sink.trpc.io/react-hook-form
           */
          e.preventDefault();
          const $form = e.currentTarget;
          const values = Object.fromEntries(new FormData($form));
          type Input = inferProcedureInput<AppRouter['post']['add']>;
          //    ^?
          const input: Input = {
            title: values.title as string,
            text: values.text as string,
          };
          try {
            await addPost.mutateAsync(input);

            $form.reset();
          } catch (cause) {
            console.error({ cause }, 'Failed to add post');
          }
        }}
      >
        <label htmlFor="title">Title:</label>
        <br />
        <input
          id="title"
          name="title"
          type="text"
          disabled={addPost.isLoading}
        />

        <br />
        <label htmlFor="text">Text:</label>
        <br />
        <textarea id="text" name="text" disabled={addPost.isLoading} />
        <br />
        <input type="submit" disabled={addPost.isLoading} />
        {addPost.error && (
          <p style={{ color: 'red' }}>{addPost.error.message}</p>
        )}
      </form>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const $form = e.currentTarget;
          const values = Object.fromEntries(new FormData($form));
          type Input = inferProcedureInput<AppRouter['manufacturer']['add']>;
          const input: Input = {
            name: values.manufacturer as string,
            yearFounded: Number(values.yearFounded) as number,
            headquarters: values.headquarters as string,
          };
          try {
            await addManufacturer.mutateAsync(input);

            $form.reset();
          } catch (cause) {
            console.error({ cause }, 'Failed to add manufacturer');
          }
        }}
      >
        <label htmlFor="manufacturer">manufacturer:</label>
        <br />
        <input
          id="manufacturer"
          name="manufacturer"
          type="text"
          disabled={addManufacturer.isLoading}
        />
        <label htmlFor="yearFounded">yearFounded:</label>
        <input
          id="yearFounded"
          name="yearFounded"
          type="text"
          disabled={addManufacturer.isLoading}
        />
        <label htmlFor="headquarters">headquarters:</label>
        <input
          id="headquarters"
          name="headquarters"
          type="text"
          disabled={addManufacturer.isLoading}
        />
        <input type="submit" disabled={addManufacturer.isLoading} />
        {addManufacturer.error && (
          <p style={{ color: 'red' }}>{addManufacturer.error.message}</p>
        )}
      </form>
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
