export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  tagline: string;
  description: string;
  basePrice: number;
  colors: ProductColor[];
  sizes: string[];
  sizeUpcharges?: Record<string, number>;
}
