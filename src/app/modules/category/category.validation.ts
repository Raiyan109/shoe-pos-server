import { z } from 'zod';

export const CategorySchema = z.object({
  category_name: z.string(),
  position: z.number(),
  created_by: z.string(),
  updated_by: z.string(),
});

export const updateCategorySchema = z.object({
  category_name: z.string().optional(),
  position: z.number().optional(),
});

export const CategoryValidationSchema = {
  CategorySchema,
  updateCategorySchema
};