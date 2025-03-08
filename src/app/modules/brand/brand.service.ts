import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBrand } from './brand.interface';
import { Brand } from './brand.model';


const createBrandIntoDB = async (brand: IBrand) => {
  console.log(brand);

  const isBrandExists = await Brand.findOne({ name: brand.brand_name })
  if (isBrandExists) {
    throw new ApiError(StatusCodes.CONFLICT, 'This brand is already exists!');
  }
  const result = await Brand.create(brand)
  return result
};



export const BrandService = {
  createBrandIntoDB
};