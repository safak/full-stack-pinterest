import { createPin, deletePin, interactPin, updatePin } from "@/api/endpoints/pin.api";
import type { ApiError, CreatePinPayload, UpdatePinPayload } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreatePin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePinPayload) => createPin(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['pins'] })
      await queryClient.invalidateQueries({ queryKey: ['images'] })
    },

    onError: (error: ApiError) => {
      return error
    },
  });
};

export const useUpdatePin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pinId, payload }: { pinId: string, payload: UpdatePinPayload }) => updatePin({ pinId, payload }),

    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['pins'] }),

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

export const useDeletePin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePin,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["pins"] });
    },
  });
};

export const useInteractPin = (pinId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: "like" | "save") => interactPin({ pinId, type }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pins", pinId, "interactions"] })
      await queryClient.invalidateQueries({ queryKey: ["pins", "saved"] })
    },
    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

