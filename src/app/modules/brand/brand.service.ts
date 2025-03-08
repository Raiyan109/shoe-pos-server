import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBrand } from './brand.interface';
import { Brand } from './brand.model';


const createBrandIntoDB = async (brand: IBrand) => {
  console.log(brand);

  // const isRecipeExists = await Brand.findOne({ name: recipe.title })
  // if (isRecipeExists) {
  //     throw new AppError(httpStatus.CONFLICT, 'This recipe is already exists!');
  // }
  // const result = await Brand.create(brand)
  // return result
};



export const BrandService = {
  createBrandIntoDB
};