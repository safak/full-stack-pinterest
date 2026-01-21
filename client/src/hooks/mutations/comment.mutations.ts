import { createComment } from "@/api/endpoints/comment.api";
import type { ApiError, CreateCommentPayload } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: CreateCommentPayload) => createComment(comment),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};