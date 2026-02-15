import { getPinComments } from "@/api/endpoints/comment.api";
import type { ApiError } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetComments = (pinId: string) => {
  return useQuery({
    queryKey: ["comments", pinId],
    queryFn: () => getPinComments(pinId),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  })
}