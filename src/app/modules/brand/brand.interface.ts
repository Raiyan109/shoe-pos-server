import { Types } from 'mongoose';

export type IBrand = {
  brand_name: string;
  created_by: string;
  updated_by: string;
  sequence: number;
  brand_status: boolean;
  brand_image: string;
  brand_image_key: string;
  // created_by: Types.ObjectId;
  // updated_by: Types.ObjectId;
};