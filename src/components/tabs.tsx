import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Link from "next/link";
import { useRouter } from "next/router";

const tabData = [
  { name: "정산입력", src: "/input" },
  { name: "정산수정", src: "/edit" },
  { name: "정산확인", src: "/result" },
];

export const TabBar = () => {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
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
