import type { Board, CreateBoardPayload, UpdateBoardPayload } from "@/types";
import api from "../axios";

export const getAllBoards = () => api.get<Board[]>("/boards");

export const getUserBoard = (userId: string) => api.get<Board[]>(`/boards/user/${userId}`);

export const getBoardById = (boardId: string) => api.get<Board>(`/boards/${boardId}`);

export const createBoard = (payload: CreateBoardPayload) => api.post<Board>("/boards", payload);

export const updateBoard = (
  boardId: string,
  payload: UpdateBoardPayload
) => api.patch<Board>(`/boards/${boardId}`, payload);

export const deleteBoard = (boardId: string) => api.delete<void>(`/boards/${boardId}`);
