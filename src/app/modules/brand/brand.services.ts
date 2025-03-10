import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBrand } from './brand.interface';
import { BrandModel } from './brand.model';
import QueryBuilder from '../../builder/QueryBuilder';



// const createBrandIntoDB = async (brand: IBrand) => {
//   const isBrandExists = await BrandModel.findOne({ name: brand.brand_name })
//   if (isBrandExists) {
//     throw new ApiError(StatusCodes.CONFLICT, 'This brand is already exists!');
//   }

//   const newSequence = brand.sequence;

//   // Step 2: Shift the sequence of brands if the new sequence is not the last one
//   const brandsToShift = await BrandModel.find({ sequence: { $gte: newSequence } }).sort({ sequence: 1 });

//   // If there's any brand with a sequence greater than or equal to the new sequence, increment their sequence
//   if (brandsToShift.length > 0) {
//     for (const brandToShift of brandsToShift) {
//       await BrandModel.findByIdAndUpdate(brandToShift._id, { $inc: { sequence: 1 } });
//     }
//   }

//   // Step 3: Create the new brand with the desired sequence
//   const result = await BrandModel.create(brand);
//   return result;
// };
const postBrandServices = async (brand: IBrand) => {
  const isBrandExists = await BrandModel.findOne({ name: brand.brand_name })
  if (isBrandExists) {
    throw new ApiError(StatusCodes.CONFLICT, 'This brand is already exists!');
  }

  const result = await BrandModel.create(brand);
  return result;
};

const getAllBrandsFromDB = async (queryParams: Record<string, unknown>) => {
  const modelQuery = BrandModel.find(); // Initial Mongoose query

  const query = new QueryBuilder(modelQuery, queryParams)
    .search(['brand_name']) // Provide searchable fields
  // .filter()
  // .sort()
  // .paginate()
  // .fields();

  const result = await query.modelQuery.sort({ sequence: 1 }); // Execute the query
  return result;
};

const updateBrandSequenceInDB = async (brandId: string, newSequence: number) => {
  const targetBrand = await BrandModel.findById(brandId);
  if (!targetBrand) {
    throw new Error('Brand not found');
  }

  const oldSequence = targetBrand.sequence;

  // Check if another brand already has the new sequence
  const existingBrand = await BrandModel.findOne({ sequence: newSequence });

  // If another brand has the same sequence, shift it
  if (existingBrand) {
    await BrandModel.findByIdAndUpdate(existingBrand._id, { sequence: oldSequence });
  }

  // Now update the target brand's sequence
  targetBrand.sequence = newSequence;
  await targetBrand.save();

  return targetBrand;
};



export const BrandServices = {
  postBrandServices,
  getAllBrandsFromDB,
  updateBrandSequenceInDB
};