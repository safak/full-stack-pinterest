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

export type UpdateUserPayload = Partial<
  Pick<User, "displayName" | "img" | "username" | "password" | "followers" | "following">
>;

export type FollowUserPayload = {
  following: string;
}
