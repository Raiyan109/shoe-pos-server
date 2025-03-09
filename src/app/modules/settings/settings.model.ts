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
    logo: {
      type: String,
      required: true,
    },
    // created_by: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    // updated_by: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

export const SettingsModel = mongoose.model<ISettings>('Settings', SettingsSchema);