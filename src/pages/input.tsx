import type { NextPage } from "next";
import Head from "next/head";
import { Box, Card, Container, Tab, Tabs, Typography } from "@mui/material";
import { LoginForm } from "@components/login-form";
import Main from "@components/layout/layout-main";
import { InputForm } from "@components/input/input-form";
import useSWR from "swr";
import { ChangeEvent, useState } from "react";

interface swr {
  ok: boolean;
  lastTotal: number;
  nothing?: boolean;
}
const tabData = [
  { name: "렉스", value: "lexx" },
  { name: "알파벳", value: "alphabet" },
];
const InputData: NextPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const { data, mutate } = useSWR<swr>(
    `/api/input/last-total/${tabData[tabValue].value}`
  );

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

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
          {data && data.lastTotal !== undefined && (
            <InputForm
              yesterdayTotal={data.lastTotal}
              site={tabData[tabValue].value}
              mutate={mutate}
            />
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
