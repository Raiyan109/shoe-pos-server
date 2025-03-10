// import { Types } from "mongoose";
// import { IAdminInterface } from "../adminRegLog/admin.interface";

export interface ICategoryInterface {
  _id?: any;
  category_name: string;
  category_slug: string;
  category_logo: string;
  category_logo_key: string;
  category_status: "active" | "in-active";
  category_serial: number;
  // category_publisher_id: Types.ObjectId | IAdminInterface;
  // category_updated_by?: Types.ObjectId | IAdminInterface;
}

export const categorySearchableField = [
  "category_name",
  "category_slug",
  "category_status",
];
