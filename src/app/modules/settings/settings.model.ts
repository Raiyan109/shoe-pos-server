import mongoose from 'mongoose';
import { ISettings } from './settings.interface';


const SettingsSchema = new mongoose.Schema<ISettings>(
  {
    title: {
      type: String,
    },
    favicon: {
      type: String,
      required: true,
    },
    favicon_key: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    logo_key: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SettingsModel = mongoose.model<ISettings>('settings', SettingsSchema);