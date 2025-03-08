import { Types } from 'mongoose';

export type IBrand = {
  brand_name: string;
  created_by: Types.ObjectId;
  updated_by: Types.ObjectId;
};