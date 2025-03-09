import mongoose from 'mongoose';
import { IBrand } from './brand.interface';


const BrandSchema = new mongoose.Schema<IBrand>(
  {
    brand_name: {
      type: String,
    },
    created_by: {
      type: String,
      required: true,
    },
    updated_by: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      default: 0
    },
    brand_status: {
      type: Boolean,
      default: true
      // required: true,
    },
    brand_image: {
      type: String,
      // required: true,
    },
    brand_image_key: {
      type: String,
      // required: true,
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

export const BrandModel = mongoose.model<IBrand>('Brand', BrandSchema);