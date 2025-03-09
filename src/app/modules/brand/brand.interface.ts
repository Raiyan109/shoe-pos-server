import { Types } from 'mongoose';
import { IStatus } from '../../../enums/status';

export type IBrand = {
  brand_name: string;
  created_by: string;
  updated_by: string;
  sequence: number;
  brand_status: IStatus;
  brand_image: string;
  brand_image_key: string;
  // created_by: Types.ObjectId;
  // updated_by: Types.ObjectId;
};