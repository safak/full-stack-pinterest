import { getUserImages } from "@/api/endpoints/image.api";
import type { ApiError } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetImages = () => {
  return useQuery({
    queryKey: ["images"],
    queryFn: () => getUserImages(),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  })

}