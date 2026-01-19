import api from "../axios";
import type { Board, CreateCommentPayload, UpdateCommentPayload } from "@/types";


export const getAllComments = () => api.get<Board[]>("/comments");

export const getCommentById = (commentId: string) => api.get<Board>(`/comments/${commentId}`);

export const createComment = (payload: CreateCommentPayload) => api.post<Board>("/comments", payload);

export const updateComment = (
  commentId: string,
  payload: UpdateCommentPayload
) => api.patch<Board>(`/comments/${commentId}`, payload);

export const deleteComment = (commentId: string) => api.delete<void>(`/comments/${commentId}`);
