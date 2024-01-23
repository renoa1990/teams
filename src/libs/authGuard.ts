import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  profile: {
    id: number;
    userId: string;
    level: string;
  };
}

export default function authGuard() {
  const { data, error } = useSWR<ProfileResponse>("/api/user/me", {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (!data.ok || !data.profile) router.push("/");
    }
  }, [data, router]);
  return {
    user: data?.profile,
    isLoading: !data && !error,
  };
}
