import type { NextPage } from "next";
import Head from "next/head";
import { Box, Card, Container, Typography } from "@mui/material";
import { LoginForm } from "@components/login-form";

const Login: NextPage = (Props) => {
  return (
    <>
      <Head>
        <title>Login</title>
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
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: "60px",
              md: "120px",
            },
          }}
        >
          <Card elevation={16} sx={{ p: 4 }}>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4">Team Lx</Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              <LoginForm {...Props} />
            </Box>
          </Card>{" "}
        </Container>
      </Box>
    </>
  );
};
const Page: NextPage = () => {
  return <Login />;
};
export default Page;
