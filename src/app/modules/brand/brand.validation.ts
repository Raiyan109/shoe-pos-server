import { z } from 'zod';

export const BrandSchema = z.object({
  brand_name: z.string(),
  created_by: z.string(),
  updated_by: z.string(),
  sequence: z.number().optional(),
});

export const BrandValidation = {
  BrandSchema,
};