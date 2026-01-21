import type { Pin } from "./pin.type";

export type Board = {
  _id?: string
  user: string
  title: string
  firstPin: Pin
  pinsCount: string
}

export type CreateBoardPayload = Omit<Board, "_id">;

export type UpdateBoardPayload = Partial<
  Pick<Board, "title">
>;
