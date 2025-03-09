import { z } from 'zod';

export const CategorySchema = z.object({
  category_name: z.string(),
  position: z.number().optional(),
  created_by: z.string(),
  updated_by: z.string(),
});

export const CategoryValidationSchema = {
  CategorySchema,
};