import mongoose from 'mongoose';
import { ICategory } from './category.interface';


const CategorySchema = new mongoose.Schema<ICategory>(
  {
    category_name: {
      type: String,
    },
    position: {
      type: Number,
    },
    created_by: {
      type: String,
      required: true,
    },
    updated_by: {
      type: String,
      required: true,
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

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);