import { getConversationById, getConversationByUser, getConversations } from "@/api/endpoints/message.api";
import type { ApiError } from "@/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetMessages = (params?: { conversationId: string }) => {
  const { conversationId = "" } = params || {};
  return useInfiniteQuery({
    queryKey: ["conversations", conversationId],
    queryFn: ({ pageParam = 0 }) => getConversationById({ pageParam, conversationId }),
    enabled: Boolean(conversationId),
    initialPageParam: 0,
    getPreviousPageParam: (firstPage: any) => firstPage.prevCursor,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  });
};

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  });
};

export const useGetConversationByUser = (receiverId: string) => {
  return useQuery({
    queryKey: ["conversations", receiverId],
    queryFn: () => getConversationByUser(receiverId),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  });
};