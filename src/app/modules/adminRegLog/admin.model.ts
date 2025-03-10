import { Schema, model } from "mongoose";
import { IAdminInterface } from "./admin.interface";

// admin Schema
const adminSchema = new Schema<IAdminInterface>(
  {
    admin_password: {
      type: String,
    },
    admin_name: {
      type: String,
    },
    admin_phone: {
      type: String,
    },
    admin_address: {
      type: String,
    },
    admin_status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    admin_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "admins",
    },
    admin_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "admins",
    },
  },
  {
    timestamps: true,
  }
);

const AdminModel = model<IAdminInterface>("admins", adminSchema);

export default AdminModel;
