export type Pin = {
  _id?: string
  media: string;
  width: number;
  height: number;
  title: string;
  description: string
  link?: string;
  board?: string
  tags?: string[]
};

export type CreatePinPayload = Omit<Pin, "_id">;

export type UpdatePinPayload = Partial<
  Pick<Pin, "board" | "description" | "title" | "tags" | "link">
>;
