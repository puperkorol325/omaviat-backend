export type Profile = {
  id: string;
  name: string;
  password: string;
  email: string;
  type: "user" | "mod" | "admin";
};

export type authData = {
  email: string,
  password: string
};

export type ProfileInfo = {
  id: string;
  name: string;
  email: string;
};
