export type Profile = {
  id: string;
  name: string;
  password: string;
  email: string;
  type: "user" | "mod" | "admin";
  ratedVideos: {id: string, rating: 'like' | 'dislike'}[];
};

export type AuthData = {
  email?: string,
  password?: string,
  APIKey?: string
};

export type ProfileInfo = {
  id?: string;
  name: string;
  email?: string;
};
