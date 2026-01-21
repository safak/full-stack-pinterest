import type { Comment, CreateCommentPayload, UpdateCommentPayload } from "@/types";
import api from "../axios";


export const getAllComments = () => api.get<Comment[]>("/comments");

export const getCommentById = (commentId: string) => api.get<Comment>(`/comments/${commentId}`);

export const getPinComments = (pindId: string) => api.get<Comment[]>(`/comments/${pindId}`);

export const createComment = (payload: CreateCommentPayload) => api.post<Comment>("/comments", payload);

export const updateComment = (
  commentId: string,
  payload: UpdateCommentPayload
) => api.patch<Comment>(`/comments/${commentId}`, payload);

export const deleteComment = (commentId: string) => api.delete<void>(`/comments/${commentId}`);
