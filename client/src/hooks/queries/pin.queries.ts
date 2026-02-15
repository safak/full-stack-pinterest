import { checkPinInteraction, getAllPins, getPinById, getSavedPins, } from "@/api/endpoints/pin.api";
import type { ApiError } from "@/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";


export const useGetPin = (pinId: string) => {
  return useQuery({
    queryKey: ["pins", pinId],
    queryFn: () => getPinById(pinId),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  });
};

export const useGetAllPins = (params?: { search?: string, userId?: string }) => {
  const { search = "", userId = "" } = params || {};
  return useInfiniteQuery({
    queryKey: ["pins", userId, search],
    queryFn: ({ pageParam = 0 }) => getAllPins({ pageParam, search, userId }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  });
};

export const useCheckPinInteraction = (pinId: string) => {
  return useQuery({
    queryKey: ["pins", pinId, "interactions"],
    queryFn: () => checkPinInteraction(pinId),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  });
};

export const useGetSavedPins = (userId: string) => {
  return useQuery({
    queryKey: ["pins", "saved"],
    queryFn: () => getSavedPins(userId),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    }
  });
};