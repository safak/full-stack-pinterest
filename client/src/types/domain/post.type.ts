
export type PostUser = {
  _id: string
  username: string;
  displayName: string;
  img: string;
  email: string;
  password?: string;
};

export type PostType = {
  _id: string
  media: string;
  width: number;
  height: number;
  title: string;
  description: string
  link?: string;
  board?: string
  tags?: string[]
  user: PostUser
  likes?: string[] 
};