import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBrand } from './brand.interface';
import { BrandModel } from './brand.model';



const createBrandIntoDB = async (brand: IBrand) => {
  console.log(brand);

  const isBrandExists = await BrandModel.findOne({ name: brand.brand_name })
  if (isBrandExists) {
    throw new ApiError(StatusCodes.CONFLICT, 'This brand is already exists!');
  }
  const result = await BrandModel.create(brand)
  return result
};

const getAllBrandsFromDB = async () => {
  const result = await BrandModel.find({})
  return result
}


export const BrandService = {
  createBrandIntoDB,
  getAllBrandsFromDB
};