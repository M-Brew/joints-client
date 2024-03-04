interface ISettingItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface IJWTPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp?: number;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface IAuthContext {
  loggedIn?: boolean;
  setLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
  user?: IUser;
  setUser?: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

