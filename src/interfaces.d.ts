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

interface IJointFormValues {
  name: string;
  description?: string;
  type: string[];
  address: string;
  latitude?: number;
  longitude?: number;
  phone: string[];
}

interface IJoint {
  _id: string;
  name: string;
  slug: string;
  description: string;
  type: { _id: string; name: string }[];
  address: string;
  latitude: number;
  longitude: number;
  phone: string[];
  verified: boolean;
  createdBy: string;
  avatar?: { _id: string; key: string; imageURL: string };
  gallery: { _id: string; key: string; imageURL: string }[];
  menu?: IMenu[];
  createdAt: string;
  updatedAt: string;
}

interface IMenuFormValues {
  joint: string;
  menuType: string;
}

interface IMenuData {
  _id: string;
  joint: { _id: string; name: string };
  menuType: { _id: string; name: string };
  meals: IMealData[];
  createdBy: string;
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface IMealData {
  _id: string;
  name: string;
  description: string;
  mealType: string;
  menu: string;
  price: number;
  currency: string;
  image: { _id: string; key: string; imageURL: string };
  createdBy: string;
  lastUpdatedBy: string;
}

interface IMealFormValues {
  name: string;
  description: string;
  mealType: string;
  price: number;
}
