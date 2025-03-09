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
  const result = await CategoryModel.create(category)
  return result
};

const getAllCategoryFromDB = async (queryParams: Record<string, unknown>) => {
  const modelQuery = CategoryModel.find(); // Initial Mongoose query

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