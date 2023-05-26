import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { NextPageWithLayout } from '~/pages/_app';
import { ReactElement } from 'react';

// this interface is needed for Cars component if the type NextPageWithLayout is not set
interface Props {
  session: Session | null;
}

const Cars: NextPageWithLayout = ({ session }) => {
  console.log({ session });
  return (
    <div>
      <h1>Cars</h1>
    </div>
  );
};

export default Cars;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const session = await getSession(context);
  const callbackUrl =
    'http://' +
    (context.req.headers.host as string) +
    (context.req.url as string);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?${new URLSearchParams({
          callbackUrl,
        })}`,
      },
      props: {},
    };
  }
  return {
    props: {
      session,
    },
  };
};

Cars.getLayout = function getLayout(component: ReactElement) {
  return (
    <>
      <h1>cars page h1 tag</h1>
      {component}
    </>
  );
};
