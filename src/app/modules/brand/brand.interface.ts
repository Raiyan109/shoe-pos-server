import { Types } from 'mongoose';

export type IBrand = {
  brand_name: string;
  created_by: string;
  updated_by: string;
  sequence: number;
  // created_by: Types.ObjectId;
  // updated_by: Types.ObjectId;
};