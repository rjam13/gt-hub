import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';
import { useSession } from 'next-auth/react';

const TuningSheetPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const name = router.query.manufacturer as string;
  const modelName = router.query.carModel as string;
  const tuningSheetId = router.query.tuningSheetId as string;
  const tuningSheetQuery = trpc.tuningSheet.byId.useQuery({
    id: tuningSheetId,
  });
  if (tuningSheetQuery.status !== 'success') {
    return <>Loading...</>;
  }
  return (
    <div>
      {tuningSheetQuery.data?.authorId === session?.user?.userId ? (
        <p>edit</p>
      ) : (
        ''
      )}
      <h2>title: {tuningSheetQuery.data?.title}</h2>
      <p>authorId: {tuningSheetQuery.data?.authorId}</p>
      <p>text: {tuningSheetQuery.data?.text}</p>
      <p>
        <>performancePoints: {tuningSheetQuery.data?.performancePoints}</>
      </p>
      <p>carId: {tuningSheetQuery.data?.carId}</p>
    </div>
  );
};

export default TuningSheetPage;

// TuningSheetPage.isProtected = true;
