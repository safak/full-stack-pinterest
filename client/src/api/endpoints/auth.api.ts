import type { AuthResponse, LoginPayload, SignupPayload } from "@/types";
import api from "../axios";

export const login = (payload: LoginPayload) =>
  api.post<AuthResponse>("/auth/login", payload);

export const signup = (payload: SignupPayload) =>
  api.post<AuthResponse>("/auth/signup", payload);
