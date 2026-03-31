export interface ProductVariant {
  sku: string;
  color: string;
  size: string;
  stock: number;
}

export interface ProductData {
  name: string;
  category: string;
  description?: string;
  variants: ProductVariant[];
  isActive: boolean;
}