
export type ThemeMode = "light" | "dark";

export type Product = {
  id: number | string;
  image: string;
  name: string;
  price: number | string;
  city: string;
};

export type AccountProvider = 'app' | 'google' | 'facebook';

export type User = {
  id: number;
  provider?: AccountProvider;
  google_id?: string | null;
  facebook_id?:string | null;
  email?: string;
  phone: string;
  name: string;
}