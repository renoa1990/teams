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
        if (data.login) {
          router.push("/input");
        } else if (data.message) {
          alert(`${data.message}`);
        }
      } else {
        alert(`${data.message}`);
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
