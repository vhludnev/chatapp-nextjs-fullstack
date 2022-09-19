import UserProfileMainScreen from '../components/dashboard/dashboard-profile-main';
import UserDashboardProfile from '../components/dashboard/dashboard-profile';
import { getSession } from 'next-auth/react';

const DashboardPage = () => {

  return (
    <div className='dashboardWrapper'>
      <UserDashboardProfile />
      <UserProfileMainScreen />
    </div>
  );
}

export default DashboardPage;


export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      //notFound: true,
      redirect: {
        destination: '/auth',
        permanent: false
      },
    };
  }

  return {
    props: { session },
  };
}