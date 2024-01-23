import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Container from "@components/container";
import Topbar from "./Topbar";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import useMutation from "@libs/useMutation";
import authGuard from "@libs/authGuard";

interface Props {
  children: React.ReactNode;
  colorInvert?: boolean;
  bgcolor?: string;
}
const menu = [
  { name: "정산입력", src: "/input" },
  { name: "정산확인", src: "/result" },
];
const Main = ({ children, colorInvert = false }: Props): JSX.Element => {
  const router = useRouter();
  authGuard();

  const [logout, { data, loading }] = useMutation("/api/user/logout");

  useEffect(() => {
    if (data && data.ok) {
      if (data.logout) {
        router.push("/");
      }
    }
  }, [data]);

  return (
    <Box>
      <Container paddingY={1}>
        <Box
          width={"100%"}
          height={20}
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          my={1}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{ py: 0.5 }}
            color="error"
            onClick={() => logout({})}
          >
            <Typography fontSize={"small"} fontWeight={"bold"}>
              로그아웃
            </Typography>
          </Button>
        </Box>
        <Box
          width={"100%"}
          height={40}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {menu.map((i) => {
            return (
              <Link
                href={i.src}
                style={{ textDecoration: "none" }}
                key={i.name}
              >
                <Box mx={2}>
                  <Typography
                    fontWeight={router.pathname === i.src ? "bold" : ""}
                    variant="h6"
                    color={router.pathname === i.src ? "black" : "gray"}
                  >
                    {i.name}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>
      </Container>
      <Divider />

      <main>
        {children}
        <Divider />
      </main>
    </Box>
  );
};

export default Main;
