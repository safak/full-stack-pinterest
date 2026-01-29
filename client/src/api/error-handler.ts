import { AxiosError } from "axios";
import type { ApiError } from "@/types";

export function handleApiError(error: unknown): ApiError {
  if (!error) {
    return {
      status: 0,
      message: "Network error. Please check your connection.",
    };
  }

  // Log full error for debugging in dev
  console.error("API error:", error);

  // Handle axios errors
  if ((error as AxiosError)?.isAxiosError) {
    const axiosErr = error as AxiosError;

    // Server responded with a status code
    if (axiosErr.response) {
      const status = axiosErr.response.status || 500;
      const data = axiosErr.response.data as any;
      const message = data?.message || data?.error || axiosErr.message || "Something went wrong";
      return {
        status,
        message,
        code: (axiosErr as any)?.code,
      };
    }

    // Request was made but no response received
    if (axiosErr.request) {
      return {
        status: 0,
        message: "No response received from server. Please check your network.",
        code: (axiosErr as any)?.code,
      };
    }

    // Something happened setting up the request
    return {
      status: 0,
      message: axiosErr.message || "Something went wrong",
      code: (axiosErr as any)?.code,
    };
  }

  // Non-axios error fallback
  const anyErr = error as any;
  return {
    status: anyErr?.status ?? 500,
    message: anyErr?.message || String(anyErr) || "Something went wrong",
    code: anyErr?.code,
  };
}
