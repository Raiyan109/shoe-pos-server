import { z } from 'zod';

export const BrandSchema = z.object({
  brand_name: z.string().optional(),
  created_by: z.string().optional(),
  updated_by: z.string().optional(),
});

export const BrandValidation = {
  BrandSchema,
};