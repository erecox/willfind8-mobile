
export type ThemeMode = "light" | "dark";

export type Product = {
  id: number | string;
  image: string;
  name: string;
  price: number | string;
  city: string;
};

export type User = {
  id: number;
  email?: string;
  phone: string;
  name: string;
}