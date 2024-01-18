import { FC, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, FormHelperText, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import useMutation from "@libs/useMutation";
import { useSnackbar } from "notistack";

interface LoginForm {
  userId: string;
  password: string;
}

export const LoginForm: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [login, { loading, data, error }] = useMutation("/api/user/login");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    if (loading) return;
    login({ data });
  };
  useEffect(() => {
    if (data) {
      if (data.ok) {
        if (data.userIdCheck || !data.passwordCheck) {
          enqueueSnackbar("아이디 또는 패스워드가 유효하지 않습니다", {
            variant: "error",
          });
          return;
        } else {
          enqueueSnackbar("환영합니다", {
            variant: "success",
          });
          router.push("/withdraw");
        }
      } else {
        enqueueSnackbar("로그인할수 없습니다", {
          variant: "error",
        });
        return;
      }
    }
  }, [data]);

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
        error={!!errors?.userId}
        helperText={errors?.userId ? errors.userId.message : null}
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        type="password"
        {...register("password", {
          required: "패스워드를 입력하세요",
        })}
        error={!!errors?.password}
        helperText={errors?.password ? errors.password.message : null}
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
};
