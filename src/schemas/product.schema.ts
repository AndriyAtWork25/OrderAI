import { z } from 'zod';

export const productVariantSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters long'),
  color: z.string().min(2, 'Color must be at least 2 characters long'),
  size: z.string().min(1, 'Size is required'),
  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters long'),
  category: z.string().min(2, 'Category must be at least 2 characters long'),
  description: z.string().optional(),
  variants: z
    .array(productVariantSchema)
    .min(1, 'At least one product variant is required'),
  isActive: z.boolean().default(true),
});