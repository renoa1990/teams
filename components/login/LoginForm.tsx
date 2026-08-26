"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

type LoginFields = {
  userId: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();

  const onSubmit = async (fields: LoginFields) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await response.json();
      if (data.ok && data.login) {
        router.push("/input");
        router.refresh();
        return;
      }
      alert(data.message ?? "아이디 또는 비밀번호를 확인하세요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        autoFocus
        fullWidth
        label="userId"
        margin="normal"
        {...register("userId", {
          required: "아이디를 입력하세요",
        })}
        error={!!errors.userId}
        helperText={errors.userId?.message ?? null}
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        type="password"
        {...register("password", {
          required: "패스워드를 입력하세요",
        })}
        error={!!errors.password}
        helperText={errors.password?.message ?? null}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          disabled={loading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Log In
        </Button>
      </Box>
    </form>
  );
}
