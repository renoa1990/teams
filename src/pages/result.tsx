import type { NextPage } from "next";
import Head from "next/head";
import { Box, Card, Container, Tab, Tabs, Typography } from "@mui/material";
import Main from "@components/layout/layout-main";
import { InputForm } from "@components/input/input-form";
import { List } from "@components/list/list";
import useSWR from "swr";
import { ChangeEvent, useState } from "react";
import { deposit, withdraw } from "@prisma/client";
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
const tabData = [
  { name: "렉스", value: "lexx" },
  { name: "알파벳", value: "alphabet" },
];
const InputData: NextPage = () => {
  const [page, setPage] = useState<number>(0);
  const [tabValue, setTabValue] = useState(0);
  const { data, mutate } = useSWR<swr>(`/api/list/${tabData[tabValue].value}`);
  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };
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
        <Tabs
          value={tabValue}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {tabData.map((item, index) => (
            <Tab
              key={index}
              label={<Typography fontWeight={"bold"}>{item.name} </Typography>}
            />
          ))}
        </Tabs>
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
