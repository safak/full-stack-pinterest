import type { UpdateUserPayload, PostUser, User } from "@/types";
import api from "../axios";

export const getAllUser = (query: string = "") => api.get<PostUser[]>(`/users?q=${encodeURIComponent(query)}`);

export const getUser = (userId: string) => api.get<User>(`/users/${userId}`);

export const updateUser = (payload: UpdateUserPayload) => api.patch<PostUser>(`/users`, payload, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const followUser = (username: string) => api.post<PostUser>(`/users/follow/${username}`);

export const deleteUser = (userId: string) => api.delete<any>(`/users/${userId}`);


