import type { User } from "./user.type";

export type Comment = {
  _id?: string
  user: User
  description: string
  pin: string
  likes?: string[]
  createdAt?: string
}

export type CreateCommentPayload = Omit<Comment, "_id" | "createdAt" | "user"> & {
  user: string
};

export type UpdateCommentPayload = Partial<
  Pick<Comment, "pin" | "description" | "likes">
>;
