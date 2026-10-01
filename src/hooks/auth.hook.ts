import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  changePassword,
  getMe,
  googleOAuth,
  userLogin,
  userLogout,
  userRegistration,
} from "@/api";
import { clearAccessToken, setAccessToken } from "@/lib/auth-token";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogin,
    onSuccess: (res) => {
      if (res?.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await userLogout();
      } catch (_err) {
        // Continue logout cleanup even if backend throws
      }
      clearAccessToken();
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useGoogleOAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleOAuth,
    onSuccess: (res) => {
      if (res?.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
