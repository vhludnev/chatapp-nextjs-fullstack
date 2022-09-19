import Head from 'next/head'; 
import Messenger from '../components/messenger/messenger'

const HomePage = () => {
  return (
    <div>
      <Head>
        <title>NextJS Chat Pro App</title>
        <meta
          name='description'
          content='Find a lot good conversations...'
        />
      </Head>
      <Messenger />
    </div>
  );
}

export default HomePage;