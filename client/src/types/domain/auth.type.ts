export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  username: string
  displayName: string
  email: string;
  img?: string
  password: string;
};

export type AuthResponse = {
  accessToken: string;
};