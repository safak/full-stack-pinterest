import { getNotifications } from "@/api/endpoints/notification.api";
import type { ApiError } from "@/types/api/api-error.type";
import { useQuery } from "@tanstack/react-query";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  });
};