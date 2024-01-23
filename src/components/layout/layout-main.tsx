import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Container from "@components/container";
import Topbar from "./Topbar";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";

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

  return (
    <Box>
      <Container paddingY={1}>
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
