import { login, logout, registerUser } from "@/api/endpoints/auth.api";
import type { ApiError, SignupPayload } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useLoginUser = () => {
  return useMutation({
    mutationFn: login,

    onSuccess: () => { },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SignupPayload) => registerUser(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: logout,

    onSuccess: () => { },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};
