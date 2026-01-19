import type { CreateUserPayload, UpdateUserPayload, User } from "@/types";
import api from "../axios";

export const getAllUser = () => api.get<User[]>("/users");

export const getUser = (userId: string) => api.get<User>(`/users/${userId}`);

export const createUser = (payload: CreateUserPayload) => api.post<User>("/users", payload);

export const updateUser = (userId: string, payload: UpdateUserPayload) => api.patch<User>(`/users/${userId}`, payload);

export const deleteUser = (userId: string) => api.delete<void>(`/users/${userId}`);


