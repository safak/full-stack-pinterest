export type User = {
  _id?: string;
  username: string;
  displayName: string;
  img: string;
  email: string;
  password?: string;
  followers?: number;
  following?: number;
  isFollowing?: boolean;
};

export type UpdateUserPayload = {
  displayName?: string;
  password?: string;
  img?: File | null;
}

export type FollowUserPayload = {
  following: string;
}
