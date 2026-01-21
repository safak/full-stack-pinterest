import type { UpdateUserPayload, User } from "@/types";
import api from "../axios";

export const getAllUser = () => api.get<User[]>("/users");

export const getUser = (userId: string) => api.get<User>(`/users/${userId}`);

export const updateUser = ({ userId, payload }: { userId: string, payload: UpdateUserPayload }) => api.patch<User>(`/users/${userId}`, payload);

export const deleteUser = (userId: string) => api.delete<any>(`/users/${userId}`);


