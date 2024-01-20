import { ChangeEvent, useState } from "react";
import { Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";

const tabData = [
  { name: "정산입력", src: "/input" },
  { name: "정산확인", src: "/result" },
];

export const TabBar = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(
    tabData.findIndex((item) => item.src === router.pathname) < 0
      ? 1
      : tabData.findIndex((item) => item.src === router.pathname)
  );

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };
  return (
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
          onClick={() => router.push(item.src)}
        />
      ))}
    </Tabs>
  );
};
