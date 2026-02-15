import type { CreateImagePayload, ImageType, UpdateImagePayload } from "@/types/domain/image.type";
import api from "../axios";


export const getUserImages = () => api.get<ImageType[]>(`/images`);

export const getImageById = (imageId: string) => api.get<ImageType>(`/images/${imageId}`);

export const createImage = (payload: CreateImagePayload) => api.post<ImageType>("/images", payload, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const updateImage = ({ imageId, payload }: { imageId: string, payload: UpdateImagePayload }) => api.patch<UpdateImagePayload>(`/images/${imageId}`, payload);

export const deleteImage = (imageId: string) => api.delete<{ message: string }>(`/images/${imageId}`);