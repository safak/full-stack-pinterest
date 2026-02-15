import { getUserBoard } from "@/api/endpoints/board.api"
import type { ApiError } from "@/types";
import { useQuery } from "@tanstack/react-query"

export const useGetBoards = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["boards", userId],
    queryFn: () => getUserBoard(),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  })

}