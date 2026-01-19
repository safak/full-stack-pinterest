import { createPin, deletePin, updatePin } from "@/api/endpoints/pin.api";
import type { ApiError } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreatePin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPin,

    onSuccess: (createPin) => {
      // 🔥 Update cache immediately (no refetch)
      queryClient.setQueryData(["pin"], createPin);
    },

    onError: (error: ApiError) => {
      console.error(error.message);
    },
  });
};

// export const useUpdatePin = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updatePin,

//     onSuccess: (updatedPin) => {
//       // 🔥 Update cache immediately (no refetch)
//       queryClient.setQueryData(["user"], updatedPin);
//     },

//     onError: (error: ApiError) => {
//       console.error(error.message);
//     },
//   });
// };

export const useDeletePin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePin,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["pin"] });
    },
  });
};

