import type { NextPage } from "next";
import Head from "next/head";
import { Box, Container } from "@mui/material";
import Main from "@components/layout/layout-main";
import useSWR from "swr";
import { useRouter } from "next/router";
import { EditForm } from "@components/edit/edit-form";
import { deposit, total, withdraw } from "@prisma/client";
import { withSsrSession } from "@libs/server/withSession";
import { IncomingMessage } from "http";
import { ServerResponse } from "http";
import client from "@libs/client";
interface serverside {
  req?: IncomingMessage;
  res?: ServerResponse;
}
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

export const getServerSideProps = withSsrSession(async function ({
  req,
  res,
}: serverside) {
  const user = req?.session.user;

  if (user) {
    const me = await client.user.findFirst({
      where: {
        id: user?.id,
        userId: user.userId,
        level: user.level,
      },
    });
    if (!me) {
      req.session.destroy();
      return {
        redirect: {
          destination: "/",
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
});
