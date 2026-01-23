import type { AuthResponse, LoginPayload, SignupPayload, PostUser } from "@/types";
import api from "../axios";

export const login = (payload: LoginPayload) =>
  api.post<AuthResponse>("/auth/login", payload);

export const registerUser = (payload: SignupPayload) =>
  api.post<PostUser>("/auth/register", payload);

export const logout = () =>
  api.post<any>("/auth/logout");
