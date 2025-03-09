import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBrand } from './brand.interface';
import { BrandModel } from './brand.model';
import QueryBuilder from '../../builder/QueryBuilder';



const createBrandIntoDB = async (brand: IBrand) => {
  console.log(brand);

  const isBrandExists = await BrandModel.findOne({ name: brand.brand_name })
  if (isBrandExists) {
    throw new ApiError(StatusCodes.CONFLICT, 'This brand is already exists!');
  }
  const result = await BrandModel.create(brand)
  return result
};

const getAllBrandsFromDB = async (queryParams: Record<string, unknown>) => {
  const modelQuery = BrandModel.find(); // Initial Mongoose query

  const query = new QueryBuilder(modelQuery, queryParams)
    .search(['brand_name']) // Provide searchable fields
  // .filter()
  // .sort()
  // .paginate()
  // .fields();

  const result = await query.modelQuery; // Execute the query
  return result;
};



export const BrandService = {
  createBrandIntoDB,
  getAllBrandsFromDB
};