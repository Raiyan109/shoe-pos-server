import { Types } from 'mongoose';

export type ISettings = {
  // _id: Types.ObjectId;
  title: string;
  favicon?: string;
  favicon_key?: string;
  logo?: string;
  logo_key?: string;
  // _v: number
  // created_by: Types.ObjectId;
  // updated_by: Types.ObjectId;
};