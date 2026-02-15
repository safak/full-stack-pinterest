import { createComment, deleteComment, updateComment } from "@/api/endpoints/comment.api";
import type { ApiError, CreateCommentPayload, UpdateCommentPayload } from "@/types";
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

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, payload }: { commentId: string; payload: UpdateCommentPayload }) => updateComment({ commentId, payload }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
}
