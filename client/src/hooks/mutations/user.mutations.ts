import { deleteUser, updateUser } from "@/api/endpoints/user.api";
import type { ApiError, UpdateUserPayload } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string, payload: UpdateUserPayload }) => updateUser({ userId, payload }),

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

