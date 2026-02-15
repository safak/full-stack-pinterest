import { useQuery } from "@tanstack/react-query";
import { getAllUser, getUser } from "@/api/endpoints/user.api";
import type { ApiError } from "@/types";



export const useGetAllUsers = ({ query = "" }: { query?: string }) => {
  return useQuery({
    queryKey: ["users", query],
    queryFn: () => getAllUser(query),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  });
};

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId),
    retry: (count, error: ApiError) => {
      if (error.status === 401) return false;
      return count < 2;
    },
  });
};
