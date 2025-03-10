import { Types } from 'mongoose';

export type ISettings = {
  title: string;
  favicon?: string;
  favicon_key?: string;
  logo?: string;
  logo_key?: string;
  // created_by: Types.ObjectId;
  // updated_by: Types.ObjectId;
};