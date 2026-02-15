import { markMessagesAsRead, sendMessage } from "@/api/endpoints/message.api";
import type { ApiError } from "@/types";
import type { CreateMessagePayload } from "@/types/domain/message.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMessagePayload) => sendMessage(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },

    onError: (error: ApiError) => {
      return error
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => markMessagesAsRead(conversationId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: (error: ApiError) => {
      return error
    },
  });
};
