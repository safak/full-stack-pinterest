import { deleteUser, followUser, updateUser } from "@/api/endpoints/user.api";
import useAuthStore from "@/lib/authStore";
import type { ApiError, UpdateUserPayload } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { setCurrentUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(payload),

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      setCurrentUser(response.data)
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => followUser(username),

    onSuccess: async () => {
      // 🔥 Update cache immediately (no refetch)
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["users"] });
    },
  });
};

