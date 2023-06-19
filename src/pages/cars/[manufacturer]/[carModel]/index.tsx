import { getSession } from 'next-auth/react';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { Fragment } from 'react';
import { NextPageWithLayout } from '~/pages/_app';
import { RouterOutput, trpc } from '~/utils/trpc';
import { redirectToSignin } from '~/utils/user';

const CarModelPage: NextPageWithLayout = () => {
  const modelName = useRouter().query.carModel as string;
  const tuningSheetQuery = trpc.tuningSheet.byCarModel.useQuery({
    name: modelName,
  });
  if (tuningSheetQuery.status !== 'success') {
    return <>Loading...</>;
  }
  return (
    <div>
      {tuningSheetQuery.data?.map((sheet, index) => {
        const pp = sheet.performancePoints;
        return (
          <Fragment key={index}>
            <h2>{sheet.title}</h2>
            <p>
              <>{pp}</>
            </p>
          </Fragment>
        );
      })}
    </div>
  );
};

export default CarModelPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const carModel = context.query.carModel;
  // const manufacturerQuery = trpc.manufacturer.byName.useQuery({ name });
  const session = await getSession(context);
  if (!session) {
    return redirectToSignin(context);
  }
  return {
    props: {},
  };
};
