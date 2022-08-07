import '../styles/globals.css';

import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="min-h-screen">
      <Component {...pageProps} />
    </div>
  </>;
}

export default MyApp
