import type { NextPage } from "next";
import Head from "next/head";
import { Box, Card, Container, Typography } from "@mui/material";
import { LoginForm } from "@components/login-form";
import Main from "@components/layout/layout-main";
import { InputForm } from "@components/input/input-form";
import useSWR from "swr";

interface swr {
  ok: boolean;
  lastTotal: number;
  nothing?: boolean;
}

const InputData: NextPage = () => {
  const { data } = useSWR<swr>("/api/input/last-total");
  return (
    <>
      <Head>
        <title>정산 입력</title>
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
          {data && data.lastTotal !== undefined && (
            <InputForm yesterdayTotal={data.lastTotal} />
          )}
          {data && data.nothing && (
            <Box display={"flex"} justifyContent={"center"} mt={10}>
              <Typography fontWeight={"bold"} variant="h5">
                "완료되지 않은 정산이 있습니다. 지난 정산을 확정 후 입력하세요"
              </Typography>
            </Box>
          )}
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
