import type { AppProps } from "next/app";
import React from "react";
import Head from "next/head";
import { SWRConfig } from "swr";
import "aos/dist/aos.css";
import Page from "@components/Page";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 10000,
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Team LX</title>
      </Head>
      <Page>
        <Component {...pageProps} />
      </Page>
    </SWRConfig>
  );
}
