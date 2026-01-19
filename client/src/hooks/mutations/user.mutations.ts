import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser } from "@/api/endpoints/user.api";
import type { ApiError } from "@/types";


export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: (createUser) => {
      // 🔥 Update cache immediately (no refetch)
      queryClient.setQueryData(["user"], createUser);
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,

    onSuccess: (updatedUser) => {
      // 🔥 Update cache immediately (no refetch)
      queryClient.setQueryData(["user"], updatedUser);
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
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });
};

