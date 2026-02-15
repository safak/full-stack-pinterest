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
  likes?: string[]
};

export type CreatePinPayload = {
  title: string;
  description: string
  link?: string;
  board?: string
  tags?: string[]
  imageId: string
}

export type PinInteraction = {
  likeCount: number;
  isLiked: boolean;
  isSaved: boolean;
};

export type UpdatePinPayload = Partial<
  Pick<Pin, "board" | "description" | "title" | "tags" | "link" | "media" | "likes">
>;
