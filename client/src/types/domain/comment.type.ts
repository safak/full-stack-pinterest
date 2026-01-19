export type Comment = {
  user: string
  description: string
  pin: string
}

export type CreateCommentPayload = Omit<Comment, "_id">;

export type UpdateCommentPayload = Partial<
  Pick<Comment, "pin" | "description">
>;
