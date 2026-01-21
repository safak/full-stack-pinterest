export type User = {
  _id?: string;
  username: string;
  displayName: string;
  img: string;
  email: string;
  password?: string;
};

export type UpdateUserPayload = Partial<
  Pick<User, "displayName" | "img" | "username" | "password">
>;
