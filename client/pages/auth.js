import { getSession } from 'next-auth/react';
import AuthForm from '../components/auth/auth-form';

const AuthPage = () => {
  return <AuthForm />;
}

export default AuthPage;


export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      //notFound: true,
      redirect: {
        destination: '/',
        permanent: false
      },
    };
  }

  return {
    props: { session },
  };
}