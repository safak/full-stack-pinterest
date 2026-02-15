export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  status: number;
  message: string;
  code?: string;
};
