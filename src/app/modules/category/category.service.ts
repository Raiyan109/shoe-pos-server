import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICategory } from './category.interface';
import { CategoryModel } from './category.model';
import QueryBuilder from '../../builder/QueryBuilder';



const createCategoryIntoDB = async (category: ICategory) => {

  const isCategoryExists = await CategoryModel.findOne({ name: category.category_name })
  if (isCategoryExists) {
    throw new ApiError(StatusCodes.CONFLICT, 'This category is already exists!');
  }

  // Get the position to insert the new category
  const position = category.position;

  // If a position is provided, shift the other categories
  if (position != null) {
    // Find all categories with position >= the new category position
    const categoriesToUpdate = await CategoryModel.find({ position: { $gte: position } });

    // Prepare the bulk update operations to increment positions
    const bulkOps = categoriesToUpdate.map((existingCategory) => ({
      updateOne: {
        filter: { _id: existingCategory._id },
        update: { $inc: { position: 1 } }, // Increment their positions by 1
      }
    }));

    // Perform the bulk update to shift existing categories' positions
    if (bulkOps.length > 0) {
      await CategoryModel.bulkWrite(bulkOps); //CategoryModel.bulkWrite(bulkOps) is used to execute all the operations in the array as a batch. It performs the updates in a single operation to improve performance.
    }
  } else {
    // If no position is provided, set it to the next available position
    const lastCategory = await CategoryModel.findOne().sort({ position: -1 }); // finds the category with the highest position by sorting the categories in descending order (position: -1). The first result (findOne()) will be the category with the largest position number.

    category.position = lastCategory ? lastCategory.position + 1 : 1; // lastCategory.position + 1: If a category exists (i.e., lastCategory is not null), it increments the position of the new category by 1 relative to the highest position in the collection. This ensures that the new category is placed at the end. If there are no categories, new category is assigned the position of 1 (because it’s the first category).
  }


  const result = await CategoryModel.create(category)
  return result
};

const getAllCategoryFromDB = async (queryParams: Record<string, unknown>) => {
  const modelQuery = CategoryModel.find().sort({ position: 1 }); // Initial Mongoose query

  const query = new QueryBuilder(modelQuery, queryParams)
    .search(['category_name']) // Provide searchable fields
  // .filter()
  // .sort()
  // .paginate()
  // .fields();

  console.log(query);


  const result = await query.modelQuery; // Execute the query
  return result;
};


const updateCategoryIntoDB = async (id: string, category: Partial<ICategory>) => {
  const categoryData = await CategoryModel.findById(id);

  if (!categoryData) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Categories not found!');
  }

  // // Only update the position if it's provided
  // if (category.position !== undefined) {
  //   // Ensure position is updated carefully, e.g., only if new position is different
  //   categoryData.position = category.position;
  // }

  // // Remove position from category if not updating it
  // delete category.position;


  // Get the position to insert the new category
  const position = category.position;

  // If a position is provided, shift the other categories
  if (position != null) {
    // Find all categories with position >= the new category position
    const categoriesToUpdate = await CategoryModel.find({ position: { $gte: position } });

    // Prepare the bulk update operations to increment positions
    const bulkOps = categoriesToUpdate.map((existingCategory) => ({
      updateOne: {
        filter: { _id: existingCategory._id },
        update: { $inc: { position: 1 } }, // Increment their positions by 1
      }
    }));

    // Perform the bulk update to shift existing categories' positions
    if (bulkOps.length > 0) {
      await CategoryModel.bulkWrite(bulkOps); //CategoryModel.bulkWrite(bulkOps) is used to execute all the operations in the array as a batch. It performs the updates in a single operation to improve performance.
    }
  } else {
    // If no position is provided, set it to the next available position
    const lastCategory = await CategoryModel.findOne().sort({ position: -1 }); // finds the category with the highest position by sorting the categories in descending order (position: -1). The first result (findOne()) will be the category with the largest position number.

    category.position = lastCategory ? lastCategory.position + 1 : 1; // lastCategory.position + 1: If a category exists (i.e., lastCategory is not null), it increments the position of the new category by 1 relative to the highest position in the collection. This ensures that the new category is placed at the end. If there are no categories, new category is assigned the position of 1 (because it’s the first category).
  }

  const result = await CategoryModel.findByIdAndUpdate(id, category, {
    new: true,
    runValidators: true,
  });
  return result;
};



export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  updateCategoryIntoDB
};