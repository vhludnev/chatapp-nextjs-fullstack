import Head from 'next/head';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';

import Layout from '../components/layout/layout';
import ErrorBoundary from '../components/error-boundary';
import Loading from '../components/spinner/loading';
import { MessengerContextProvider } from '../store/messenger-context';
import { NotificationContextProvider } from '../store/notification-context';

import '../styles/globals.css'

const MyApp = ({ Component, pageProps: { session, ...pageProps} }) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      //console.log("start");
      setLoading(true);
    };
    const end = () => {
      //console.log("findished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <NotificationContextProvider>
          <MessengerContextProvider>
            <Layout>
              <Head>
                <title>Next Events</title>
                <meta charSet="utf-8" />
                <meta name='viewport' content='initial-scale=1.0, width=device-width' />
                <link rel="shortcut icon" href="/favicon.ico" />
              </Head>
              {loading ? <Loading /> : <Component {...pageProps} />}
            </Layout>
          </MessengerContextProvider>
        </NotificationContextProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}

export default MyApp;
