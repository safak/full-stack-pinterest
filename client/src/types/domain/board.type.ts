export type Board = {
  user: string
  title: string
}

export type CreateBoardPayload = Omit<Board, "_id">;

export type UpdateBoardPayload = Partial<
  Pick<Board, "title">
>;
