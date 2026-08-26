"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const menu = [
  { name: "정산입력", src: "/input" },
  { name: "정산확인", src: "/result" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/user/logout", { method: "POST" });
      const data = await response.json();
      if (data.ok && data.logout) {
        router.push("/");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          maxWidth: { sm: 720, md: 1236 },
          width: 1,
          mx: "auto",
          px: 2,
          py: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: 20,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            my: 1
          }}>
          <Button
            variant="outlined"
            size="small"
            sx={{ py: 0.5 }}
            color="error"
            onClick={logout}
            disabled={loading}
          >
            <Typography
              sx={{
                fontSize: "small",
                fontWeight: "bold"
              }}>
              로그아웃
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
          {menu.map((item) => {
            const active = pathname === item.src || pathname.startsWith(`${item.src}/`);
            return (
              <Link
                href={item.src}
                style={{ textDecoration: "none" }}
                key={item.name}
              >
                <Box sx={{
                  mx: 2
                }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: active ? "bold" : undefined,
                      color: active ? "black" : "gray",
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>
      </Box>
      <Divider />
      <main>
        {children}
        <Divider />
      </main>
    </Box>
  );
}
