import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';

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

CarModelPage.isProtected = true;
