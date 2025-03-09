import { z } from 'zod';

export const BrandSchema = z.object({
  brand_name: z.string(),
  created_by: z.string(),
  updated_by: z.string(),
  sequence: z.number().optional(),
  status: z.boolean(),
  image: z.string(),
  imageKey: z.string(),
});

export const BrandValidation = {
  BrandSchema,
};