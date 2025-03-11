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
// Create a brand
const postBrandServices = async (brand: IBrand) => {
  const isBrandExists = await BrandModel.findOne({ name: brand.brand_name })
  if (isBrandExists) {
    throw new ApiError(StatusCodes.CONFLICT, 'This brand is already exists!');
  }

  const result = await BrandModel.create(brand);
  return result;
};

// Find brand
const findAllBrandsServices = async (queryParams: Record<string, unknown>) => {
  const modelQuery = BrandModel.find({ brand_status: "active" }); // Initial Mongoose query

  const query = new QueryBuilder(modelQuery, queryParams)
    .search(['brand_name']) // Provide searchable fields
    // .filter()
    .sort()
    .paginate()
  // .fields();

  const result = await query.modelQuery.sort({ sequence: 1 }); // Execute the query
  return result;
};


// Find all dashboard Brand
export const findAllDashboardCategoryServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IBrand[] | []> => {
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
  findAllBrandsServices,
  updateBrandSequenceInDB
};