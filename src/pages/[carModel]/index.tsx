import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';
import Link from 'next/link';

const CarModelPage: NextPageWithLayout = () => {
  const router = useRouter();
  const modelName = router.query.carModel as string;
  const tuningSheetQuery = trpc.tuningSheet.byCarModel.useQuery({
    name: modelName,
  });
  if (tuningSheetQuery.status !== 'success') {
    return <>Loading...</>;
  }
  return (
    <div>
      {tuningSheetQuery.data?.map((sheet, index) => {
        return (
          <Fragment key={index}>
            <Link href={`/${modelName}/${sheet.id}`}>
              <h2>{sheet.title}</h2>
              <p>
                <>{sheet.performancePoints}</>
              </p>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
};

export default CarModelPage;

// CarModelPage.isProtected = true;
