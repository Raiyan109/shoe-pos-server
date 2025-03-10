import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  categorySearchableField,
  ICategoryInterface,
} from "./category.interface";
import {
  deleteCategoryServices,
  findAllCategoryServices,
  findAllDashboardCategoryServices,
  postCategoryServices,
  updateCategoryServices,
} from "./category.services";
import * as fs from "fs";
import CategoryModel from "./category.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { FileUploadHelper } from "../../../helpers/helpers/image.upload";
import sendResponse from "../../../shared/sendResponse";
import slugify from "slugify";

// Add A Category
export const postCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICategoryInterface | any> => {
  try {
    if (req.files && "category_logo" in req.files && req.body) {
      const requestData = req.body;
      let category_slug = slugify(requestData?.category_name);

      const findCategoryNameExit: boolean | null | undefined | any =
        await CategoryModel.exists({
          category_slug,
        });
      if (findCategoryNameExit) {
        fs.unlinkSync(req.files.category_logo[0].path);
        throw new ApiError(400, "Already Added !");
      }
      const findCategorySerialExit: boolean | null | undefined | any =
        await CategoryModel.exists({
          category_serial: requestData?.category_serial,
        });
      if (findCategorySerialExit) {
        fs.unlinkSync(req.files.category_logo[0].path);
        throw new ApiError(400, "Serial Number Previously Added !");
      }
      // get the category image and upload
      let category_logo;
      let category_logo_key;
      if (req.files && "category_logo" in req.files) {
        const categoryImage = req.files["category_logo"][0];
        const category_logo_upload = await FileUploadHelper.uploadToSpaces(
          categoryImage
        );
        category_logo = category_logo_upload?.Location;
        category_logo_key = category_logo_upload?.Key;
      }
      const data = { ...requestData, category_logo, category_logo_key, category_slug };
      const result: ICategoryInterface | {} = await postCategoryServices(data);
      if (result) {
        return sendResponse<ICategoryInterface>(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: "Category Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Category Added Failed !");
      }
    } else {
      throw new ApiError(400, "Image Upload Failed");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Category
export const findAllCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICategoryInterface | any> => {
  try {
    const result: ICategoryInterface[] | any = await findAllCategoryServices();
    return sendResponse<ICategoryInterface>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Category Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard Category
export const findAllDashboardCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICategoryInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICategoryInterface[] | any =
      await findAllDashboardCategoryServices(limitNumber, skip, searchTerm);
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
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CategoryModel.countDocuments(whereCondition);
    return sendResponse<ICategoryInterface>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Category Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Category
export const updateCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICategoryInterface | any> => {
  try {
    if (req.files && "category_logo" in req.files && req.body) {
      const requestData = req.body;
      let category_slug = slugify(requestData?.category_name);
      const findCategoryNameExit: boolean | null | undefined | any =
        await CategoryModel.exists({
          category_slug,
        });
      if (
        findCategoryNameExit &&
        requestData?._id !== findCategoryNameExit?._id.toString()
      ) {
        fs.unlinkSync(req.files.category_logo[0].path);
        throw new ApiError(400, "Already Added !");
      }
      const findCategorySerialExit: boolean | null | undefined | any =
        await CategoryModel.exists({
          category_serial: requestData?.category_serial,
        });
      if (
        findCategorySerialExit &&
        requestData?._id !== findCategorySerialExit?._id.toString()
      ) {
        fs.unlinkSync(req.files.category_logo[0].path);
        throw new ApiError(400, "Serial Number Previously Added !");
      }

      // get the category image and upload
      let category_logo;
      let category_logo_key;
      if (req.files && "category_logo" in req.files) {
        const categoryImage = req.files["category_logo"][0];
        const category_logo_upload = await FileUploadHelper.uploadToSpaces(
          categoryImage
        );
        category_logo = category_logo_upload?.Location;
        category_logo_key = category_logo_upload?.Key;
      }
      const data = { ...requestData, category_logo, category_logo_key, category_slug };
      const result: ICategoryInterface | any = await updateCategoryServices(
        data,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        if (requestData?.category_logo_key) {
          await FileUploadHelper.deleteFromSpaces(
            requestData?.category_logo_key
          );
        }
        return sendResponse<ICategoryInterface>(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: "Category Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Category Update Failed !");
      }
    } else {
      const requestData = req.body;
      let category_slug = slugify(requestData?.category_name);
      const findCategoryNameExit: boolean | null | undefined | any =
        await CategoryModel.exists({
          category_slug,
        });
      if (
        findCategoryNameExit &&
        requestData?._id !== findCategoryNameExit?._id.toString()
      ) {
        throw new ApiError(400, "Already Added !");
      }
      const findCategorySerialExit: boolean | null | undefined | any =
        await CategoryModel.exists({
          category_serial: requestData?.category_serial,
        });
      if (
        findCategorySerialExit &&
        requestData?._id !== findCategorySerialExit?._id.toString()
      ) {
        throw new ApiError(400, "Serial Number Previously Added !");
      }
      const result: ICategoryInterface | any = await updateCategoryServices(
        requestData,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        return sendResponse<ICategoryInterface>(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: "Category Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Category Update Failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};

// delete A Category item
export const deleteACategoryInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category_id = req.body._id;
    // const findCategoryInSubCategoryExist: boolean | null | undefined | any =
    //   await SubCategoryModel.exists({
    //     category_id: category_id,
    //   });
    // if (findCategoryInSubCategoryExist) {
    //   throw new ApiError(400, "Already Added In SubCategory !");
    // }
    // const findCategoryInChildCategoryExist: boolean | null | undefined | any =
    //   await ChildCategoryModel.exists({
    //     category_id: category_id,
    //   });
    // if (findCategoryInChildCategoryExist) {
    //   throw new ApiError(400, "Already Added In ChildCategory !");
    // }
    // const findCategoryInBrandExist: boolean | null | undefined | any =
    //   await BrandModel.exists({
    //     category_id: category_id,
    //   });
    // if (findCategoryInBrandExist) {
    //   throw new ApiError(400, "Already Added In Brand !");
    // }
    const result = await deleteCategoryServices(category_id);
    if (result?.deletedCount > 0) {
      if (req.body?.category_logo_key) {
        await FileUploadHelper.deleteFromSpaces(req.body?.category_logo_key);
      }
      return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Category Delete successfully !",
      });
    } else {
      throw new ApiError(400, "Category delete failed !");
    }
  } catch (error) {
    next(error);
  }
};
