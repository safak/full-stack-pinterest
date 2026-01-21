import type { AuthResponse, LoginPayload, SignupPayload, User } from "@/types";
import api from "../axios";

export const login = (payload: LoginPayload) =>
  api.post<AuthResponse>("/auth/login", payload);

export const registerUser = (payload: SignupPayload) =>
  api.post<User>("/auth/register", payload);

export const logout = () =>
  api.post<any>("/auth/logout");
