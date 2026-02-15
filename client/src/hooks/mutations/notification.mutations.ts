import { deleteNotification, markNotificationAsRead } from "@/api/endpoints/notification.api";
import type { ApiError } from "@/types/api/api-error.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ notificationId, type,entityId }: { notificationId?: string; type?: "single" | "all", entityId?: string }) => markNotificationAsRead({ notificationId, type, entityId }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};