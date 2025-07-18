
export type ThemeMode = "light" | "dark";

export type Category = {
  id: number | string;
  image: string;
  name: string;
};

export type Picture = {
  thumbnail: string;
  full: string;
}

export type Product = {
  id: number | string;
  image: string;
  name: string;
  price: number | string;
  city: string;
  category: string;
  category_id?: number;
  description: string | null;
  category_field_id?: number;
  view_count?: number;
  specs?: ProductSpec[]
  seller?: User;
  picture: Picture;
  pictures?: Picture[]
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
  photo?: Picture;
  family_name?: string | null;
  given_name?: string | null;
}

export type Suggestion = {
  id: string;
  keyword: string;
  product_id: number;
  category_id: number;
  category_field_id: number;
  is_recent?: boolean;
};

export type Field = "select" | "multi-select" | "text" | "number" | "tel" | "rich-text";

export type ProductSpec = {
  id: number,
  name: string,
  field: Field,
  value: string | string[] | number;
};