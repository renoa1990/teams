import type { NextPage } from "next";
import Head from "next/head";
import { Box, Card, Container, Typography } from "@mui/material";
import { LoginForm } from "@components/login-form";
import Main from "@components/layout/layout-main";
import { InputForm } from "@components/input/input-form";
import { List } from "@components/list/list";
import useSWR from "swr";
import { useState } from "react";
import { deposit, withdraw } from "@prisma/client";

interface swr {
  ok: boolean;
  list: {
    id: number;
    totalAt: Date;
    createAt: Date;
    yesterDayTotal: number;
    todayTotal: number;
    solutionTotal: number;
    marginTotla: number;
    withdraw: withdraw[];
    deposit: deposit[];
    withdrawCount: number;
    withdrawTotal: number;
    depositCount: number;
    depositTotal: number;
    confirm: boolean;
  }[];
}

const InputData: NextPage = () => {
  const [page, setPage] = useState<number>(0);
  const { data, mutate } = useSWR<swr>(`/api/list/${page}`);
  return (
    <>
      <Head>
        <title>정산 리스트</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="lg">
          {data && <List list={data.list} mutate={mutate} />}
        </Container>
      </Box>
    </>
  );
};
const Page: NextPage = () => {
  return (
    <Main>
      <InputData />
    </Main>
  );
};
export default Page;
