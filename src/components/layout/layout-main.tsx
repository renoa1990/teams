import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Container from "@components/container";
import Topbar from "./Topbar";
import { TabBar } from "@components/tabs";

interface Props {
  children: React.ReactNode;
  colorInvert?: boolean;
  bgcolor?: string;
}

const Main = ({ children, colorInvert = false }: Props): JSX.Element => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 38,
  });

  return (
    <Box>
      <Container paddingY={1}>
        <Topbar colorInvert={trigger ? false : colorInvert} />
      </Container>

      <main>
        <TabBar />
        <Divider />
        {children}
        <Divider />
      </main>
    </Box>
  );
};

export default Main;
