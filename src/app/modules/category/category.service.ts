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

// Step 2: If a position is provided, shift the other categories
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
    await CategoryModel.bulkWrite(bulkOps);
  }
} else {
  // If no position is provided, set it to the next available position
  const lastCategory = await CategoryModel.findOne().sort({ position: -1 });
  category.position = lastCategory ? lastCategory.position + 1 : 1;
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



export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB
};