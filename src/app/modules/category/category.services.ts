import ApiError from "../../../errors/ApiError";
import {
  ICategoryInterface,
  categorySearchableField,
} from "./category.interface";
import CategoryModel from "./category.model";

// Create A Category
export const postCategoryServices = async (
  data: ICategoryInterface
): Promise<ICategoryInterface | {}> => {
  const createCategory: ICategoryInterface | {} = await CategoryModel.create(
    data
  );
  return createCategory;
};

// Find Category
export const findAllCategoryServices = async (): Promise<
  ICategoryInterface[] | []
> => {
  const findCategory: ICategoryInterface[] | [] = await CategoryModel.find({
    category_status: "active",
  })
    .sort({ category_serial: 1 })
    .select("-__v");
  return findCategory;
};

// Find all dashboard Category
export const findAllDashboardCategoryServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICategoryInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: categorySearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findCategory: ICategoryInterface[] | [] = await CategoryModel.find(
    whereCondition
  )
    .sort({ category_serial: 1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findCategory;
};

// Update a Category
export const updateCategoryServices = async (
  data: ICategoryInterface,
  _id: string
): Promise<ICategoryInterface | any> => {
  const updateCategoryInfo: ICategoryInterface | null =
    await CategoryModel.findOne({ _id: _id });
  if (!updateCategoryInfo) {
    throw new ApiError(404, "Category not found");
  }
  const Category = await CategoryModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Category;
};

// Delete a Category
export const deleteCategoryServices = async (
  _id: string
): Promise<ICategoryInterface | any> => {
  const updateCategoryInfo: ICategoryInterface | null =
    await CategoryModel.findOne({ _id: _id });
  if (!updateCategoryInfo) {
    throw new ApiError(404, "Category not found");
  }
  const Category = await CategoryModel.deleteOne(
    { _id: _id },
    {
      runValidators: true,
    }
  );
  return Category;
};
