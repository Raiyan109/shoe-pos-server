import { Types } from "mongoose";

export interface IAdminInterface {
  _id?: any;
  admin_password?: string;
  admin_name?: string;
  admin_phone: string;
  admin_address?: string;
  admin_status?: "active" | "in-active";
  admin_publisher_id?: Types.ObjectId | IAdminInterface;
  admin_updated_by?: Types.ObjectId | IAdminInterface;
}

export const adminSearchableField = [
  "admin_name",
  "admin_phone",
  "admin_status",
  "admin_address",
];
