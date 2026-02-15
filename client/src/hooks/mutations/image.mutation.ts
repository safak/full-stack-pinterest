import { createImage, deleteImage, updateImage } from "@/api/endpoints/image.api";
import type { ApiError } from "@/types";
import type { CreateImagePayload, UpdateImagePayload } from "@/types/domain/image.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateImagePayload) => createImage(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['images'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useUpdateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, payload }: { imageId: string, payload: UpdateImagePayload }) => updateImage({imageId, payload}),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['images'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => deleteImage(imageId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['images'] })
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};