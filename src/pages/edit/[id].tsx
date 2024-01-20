import type { NextPage } from "next";
import Head from "next/head";
import { Box, Card, Container, Typography } from "@mui/material";
import { LoginForm } from "@components/login-form";
import Main from "@components/layout/layout-main";
import { InputForm } from "@components/input/input-form";
import useSWR from "swr";
import { useRouter } from "next/router";
import { EditForm } from "@components/edit/edit-form";
import { deposit, total, withdraw } from "@prisma/client";

interface swr {
  ok: boolean;
  data: another;
  nothing?: boolean;
}

interface another extends total {
  deposit: deposit[];
  withdraw: withdraw[];
}

const InputData: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, mutate } = useSWR<swr>(`/api/edit/${id}`);
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
          {data && data.data && (
            <EditForm editData={data.data} mutate={mutate} />
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
