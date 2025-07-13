
export type ThemeMode = "light" | "dark";

export type Category = {
  id: number | string;
  image: string;
  name: string;
};

export type Product = {
  id: number | string;
  image: string;
  name: string;
  price: number | string;
  city: string;
  category: string;
};

export type AccountProvider = 'app' | 'google' | 'facebook';

export type User = {
  id: string;
  provider?: AccountProvider;
  google_id?: string | null;
  facebook_id?: string | null;
  email?: string | null;
  phone?: string | null;
  name?: string;
  photo?: string | null;
  family_name?: string | null;
  given_name?: string | null;
}