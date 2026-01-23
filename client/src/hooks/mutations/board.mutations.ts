import { createBoard } from "@/api/endpoints/board.api";
import type { ApiError, CreateBoardPayload } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBoardPayload) => createBoard(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['boards'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};