import { getSession } from 'next-auth/react';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { NextPageWithLayout } from '~/pages/_app';
import { redirectToSignin } from '~/utils/user';
import { Fragment } from 'react';
import Link from 'next/dist/client/link';
import { trpc } from '~/utils/trpc';

// Might be useful for showing each car of the manufacturer
// function PostItem(props: { post: PostByIdOutput }) {
//   const { post } = props;
//   return (
//     <>
//       <h1>{post.title}</h1>
//       <em>Created {post.createdAt.toLocaleDateString('en-us')}</em>

//       <p>{post.text}</p>

//       <h2>Raw data:</h2>
//       <pre>{JSON.stringify(post, null, 4)}</pre>
//     </>
//   );
// }

const ManufacturerPage: NextPageWithLayout = () => {
  const name = useRouter().query.manufacturer as string;
  const manufacturerQuery = trpc.manufacturer.byName.useQuery({ name });

  if (manufacturerQuery.error) {
    return (
      <NextError
        title={manufacturerQuery.error.message}
        statusCode={manufacturerQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (manufacturerQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = manufacturerQuery;
  return (
    <div>
      <h1>{data?.name}</h1>
      {data?.models.map((model, index) => (
        <Fragment key={index}>
          <Link href={`/cars/${name}/${model.name}`}>
            <div>
              <b>{model.name}</b>
            </div>
          </Link>
        </Fragment>
      ))}
    </div>
  );
};

export default ManufacturerPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return redirectToSignin(context);
  }
  return {
    props: {},
  };
};
