import { useMutation } from "@tanstack/react-query";
import { login, signup } from "@/api/endpoints/auth.api";
import { setAccessToken } from "@/lib/auth-store";
import type { ApiError } from "@/types";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,

    onSuccess: (data: any) => {
      setAccessToken(data.accessToken);
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,

    onSuccess: (data: any) => {
      setAccessToken(data.accessToken);
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};
