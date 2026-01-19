import api from "../axios";
import type {
  Pin,
  CreatePinPayload,
  UpdatePinPayload,
  PostType,
} from "@/types";


export const getAllPins = ({ pageParam, search, userId }: { pageParam: string, search: string, userId: string }) => api.get<Pin[]>(`/pins?cursor=${pageParam}&search=${search || ""}&userId=${userId || ""}`);

export const getPinById = (pinId: string) => api.get<PostType>(`/pins/${pinId}`);

export const createPin = (payload: CreatePinPayload) => api.post<Pin>("/pins", payload);

export const updatePin = (
  pinId: string,
  payload: UpdatePinPayload
) => api.patch<Pin>(`/pins/${pinId}`, payload);

export const deletePin = (pinId: string) => api.delete<void>(`/pins/${pinId}`);
