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

  // If position is provided, we need to update the position and adjust other categories

  const newPosition = category.position;

  // swap approach


  // // Check if the new position is the same as the current position (no update needed if same)
  // if (category.position !== undefined && newPosition !== categoryData.position) {
  //  // Get the category at the new position (the one to swap with)
  //  const categoryAtNewPosition = await CategoryModel.findOne({ position: newPosition });

  //  if (!categoryAtNewPosition) {
  //    throw new ApiError(StatusCodes.NOT_FOUND, 'Category at the new position not found');
  //  }

  //  //Swap the positions of the two categories
  //  const bulkOps = [
  //    {
  //      updateOne: {
  //        filter: { _id: categoryData._id },
  //        update: { $set: { position: newPosition } }  // Move the current category to the new position
  //      }
  //    },
  //    {
  //      updateOne: {
  //        filter: { _id: categoryAtNewPosition._id },
  //        update: { $set: { position: categoryData.position } }  // Move the category at the new position to the old position
  //      }
  //    }
  //  ];

  //  // Execute the bulk update for both categories (swap their positions)
  //  await CategoryModel.bulkWrite(bulkOps);



  //alternative approach (increment and decrement)


  // Step 2: If the position is provided and different from the current position
  if (newPosition !== undefined && newPosition !== categoryData.position) {

    // Step 3: Determine if the move is upward (to a higher position) or downward (to a lower position)
    const moveUp = newPosition < categoryData.position;

    // Step 4: If moving up (e.g., from position 6 to 4)
    if (moveUp) {
      // Find the categories between the old position and the new position
      const categoriesToUpdate = await CategoryModel.find({
        position: { $gte: newPosition, $lt: categoryData.position },
      });

      // Prepare the bulk operations to increment the position of affected categories
      const bulkOps = categoriesToUpdate.map((category) => ({
        updateOne: {
          filter: { _id: category._id },
          update: { $inc: { position: 1 } }, // Shift categories down by 1
        }
      }));

      // Perform the bulk update for affected categories
      if (bulkOps.length > 0) {
        await CategoryModel.bulkWrite(bulkOps);
      }
    }
    // Step 5: If moving down (e.g., from position 4 to 6)
    else {
      // Find the categories between the old position and the new position
      const categoriesToUpdate = await CategoryModel.find({
        position: { $gt: categoryData.position, $lte: newPosition },
      });

      // Prepare the bulk operations to decrement the position of affected categories
      const bulkOps = categoriesToUpdate.map((category) => ({
        updateOne: {
          filter: { _id: category._id },
          update: { $inc: { position: -1 } }, // Shift categories up by 1
        }
      }));

      // Perform the bulk update for affected categories
      if (bulkOps.length > 0) {
        await CategoryModel.bulkWrite(bulkOps);
      }
    }

    // Step 6: Now update the current category's position to the new position
    category.position = newPosition; // Set the correct new position

    // Step 7: Update the category with the provided data
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: category },
      { new: true }
    );

    return updatedCategory;
  }





  // If there are other fields to update (like category_name), update them
  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    id,
    { $set: category },
    { new: true }
  );

  return updatedCategory;

};



export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  updateCategoryIntoDB
};