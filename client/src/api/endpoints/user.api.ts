import type { UpdateUserPayload, PostUser, User } from "@/types";
import api from "../axios";

export const getAllUser = () => api.get<PostUser[]>("/users");

export const getUser = (userId: string) => api.get<User>(`/users/${userId}`);

export const updateUser = ({ userId, payload }: { userId: string, payload: UpdateUserPayload }) => api.patch<PostUser>(`/users/${userId}`, payload);

export const followUser = (username: string) => api.post<PostUser>(`/users/follow/${username}`);

export const deleteUser = (userId: string) => api.delete<any>(`/users/${userId}`);


