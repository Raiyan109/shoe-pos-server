import { z } from 'zod';

export const SettingsSchema = z.object({
  title: z.string().optional(),
  favicon: z.string().optional(),
  logo: z.string().optional(),
});

export const UpdateSettingsSchema = z.object({
  title: z.string().optional(),
  favicon: z.string().optional(),
  logo: z.string().optional(),
});

export const SettingsValidation = {
  SettingsSchema,
  UpdateSettingsSchema
};