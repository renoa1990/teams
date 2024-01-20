import type { AppProps } from "next/app";
import React from "react";
import Head from "next/head";
import { SWRConfig } from "swr";
import "aos/dist/aos.css";
import Page from "@components/Page";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import koLocale from "date-fns/locale/ko";
import moment from "moment";
import "moment/locale/ko"; // 한국어 로케일 추가

moment.locale("ko"); // 전역으로 한국어 로케일 설정

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
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={koLocale}
      >
        <Page>
          <Component {...pageProps} />
        </Page>
      </LocalizationProvider>
    </SWRConfig>
  );
}
