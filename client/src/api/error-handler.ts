import { AxiosError } from "axios";
import type { ApiError } from "@/types";


export function handleApiError(error: AxiosError): ApiError {
  if (!error.response) {
    return {
      status: 0,
      message: "Network error. Please check your connection.",
    };
  }

  const { status, data } = error.response as any;

  return {
    status,
    message: data?.message || "Something went wrong",
    code: data?.code,
  };
}
