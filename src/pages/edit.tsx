import type { NextPage } from "next";
import Head from "next/head";
import { Box, Card, Container, Typography } from "@mui/material";
import { LoginForm } from "@components/login-form";
import Main from "@components/layout/layout-main";
import { InputForm } from "@components/input/input-form";

const InputData: NextPage = (Props) => {
  return (
    <>
      <Head>
        <title>정산 수정</title>
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
          <InputForm />
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
