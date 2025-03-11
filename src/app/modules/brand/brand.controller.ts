import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BrandServices } from './brand.services';
import { StatusCodes } from 'http-status-codes';
import { IStatus } from '../../../enums/status';
import { IBrand } from './brand.interface';
import { FileUploadHelper } from '../../../helpers/helpers/image.upload';
import ApiError from '../../../errors/ApiError';
import slugify from "slugify";
import { BrandModel } from './brand.model';
import * as fs from "fs";


const postBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check if the 'data' field is a stringified JSON object
  // let brand_name = '';
  // let created_by = '';
  // let updated_by = '';
  // let brand_status: IStatus = 'Active';
  // let sequence = 0;
  // let brand_image_key = '1';

  // if (req.body.data) {
  //   const parsedData = JSON.parse(req.body.data); // Parse the 'data' field
  //   brand_name = parsedData.brand_name;  // Extract 'title' from the parsed object
  //   created_by = parsedData.created_by;  // Extract 'title' from the parsed object
  //   updated_by = parsedData.updated_by;  // Extract 'title' from the parsed object
  //   brand_status = parsedData.brand_status === true ? 'InActive' : 'Active';
  //   sequence = parsedData.sequence;  // Extract 'title' from the parsed object
  //   brand_image_key = parsedData.brand_image_key;  // Extract 'title' from the parsed object
  // } else {
  //   brand_name = req.body.brand_name;  // Extract 'title' from the parsed object
  //   created_by = req.body.created_by;  // Extract 'title' from the parsed object
  //   updated_by = req.body.updated_by;  // Extract 'title' from the parsed object
  //   brand_status = req.body.brand_status === true ? 'InActive' : 'Active';
  //   sequence = req.body.sequence;  // Extract 'title' from the parsed object
  //   brand_image_key = req.body.brand_image_key;  // Extract 'title' from the parsed object
  // }

  // // Ensure TypeScript understands req.files is an object
  // const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // const brand_image = files?.['image']?.[0]?.path;

  // const brandData: IBrand = {
  //   brand_name,
  //   created_by,
  //   updated_by,
  //   sequence,
  //   brand_status,
  //   brand_image_key,
  //   brand_image
  // };

  try {
    if (req.files && "brand_logo" in req.files && req.body) {
      const requestData = req.body;
      let brand_slug = slugify(requestData?.brand_name);

      const findBrandNameExist = await BrandModel.exists({ brand_slug });

      if (findBrandNameExist) {
        if (req.files?.brand_logo?.[0]?.path) {
          try {
            fs.unlinkSync(req.files.brand_logo[0].path);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }
        throw new ApiError(StatusCodes.BAD_REQUEST, 'This brand already exists!');
      }

      const findBrandSerialExist = await BrandModel.exists({
        brand_serial: requestData?.brand_serial,
      });

      if (findBrandSerialExist) {
        if (req.files?.brand_logo?.[0]?.path) {
          try {
            fs.unlinkSync(req.files.brand_logo[0].path);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Serial Number Previously Added!');
      }


      // get the category image and upload
      let brand_logo;
      let brand_logo_key;
      if (req.files && "brand_logo" in req.files) {
        const brandImage = req.files["brand_logo"][0];
        const brand_logo_upload = await FileUploadHelper.uploadToSpaces(
          brandImage
        );
        brand_logo = brand_logo_upload?.Location;
        brand_logo_key = brand_logo_upload?.Key;
      }

      const data = { ...requestData, brand_logo, brand_logo_key, brand_slug };
      const result = await BrandServices.postBrandServices(data);

      if (result) {
        return sendResponse<IBrand>(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: "Brand Added Successfully !",
          data: result
        });
      } else {
        throw new ApiError(400, "Brand Added Failed !");
      }
    } else {
      throw new ApiError(400, "Image Upload Failed");
    }
  } catch (error: any) {
    next(error);
  }
});


const findAllBrand = catchAsync(async (req, res) => {
  const query = req.query
  const result = await BrandServices.findAllBrandsServices(query);

  // Check if the database collection is empty or no matching data is found
  if (!result || result.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'No data found.',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Brands retrieved successfully',
    data: result,
  });
});

const findAllDashboardCategory = catchAsync(async (req, res) => {
  const query = req.query
  const result = await BrandServices.findAllDashboardCategoryServices(query);

  // Check if the database collection is empty or no matching data is found
  if (!result || result.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'No data found.',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dashboard brands retrieved successfully',
    data: result,
  });
});

const updateBrand = catchAsync(async (req, res, next) => {
  try {
    if (req.files && "brand_logo" in req.files && req.body) {
      const requestData = req.body;

      const findBrandNameExist = await BrandModel.exists({ brand_slug: requestData?.brand_slug });
      if (findBrandNameExist) {
        if (req.files?.brand_logo?.[0]?.path) {
          try {
            fs.unlinkSync(req.files.brand_logo[0].path);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }
        throw new ApiError(StatusCodes.BAD_REQUEST, 'This brand already exists!');
      }

      const findBrandSerialExist = await BrandModel.exists({
        brand_serial: requestData?.brand_serial,
      });
      if (findBrandSerialExist) {
        if (req.files?.brand_logo?.[0]?.path) {
          try {
            fs.unlinkSync(req.files.brand_logo[0].path);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Serial Number Previously Added!');
      }

      // get the category image and upload
      let brand_logo;
      let brand_logo_key;
      if (req.files && "brand_logo" in req.files) {
        const brandImage = req.files["brand_logo"][0];
        const brand_logo_upload = await FileUploadHelper.uploadToSpaces(
          brandImage
        );
        brand_logo = brand_logo_upload?.Location;
        brand_logo_key = brand_logo_upload?.Key;
      }
      const data = { ...requestData, brand_logo, brand_logo_key };
      const result: IBrand | any = await BrandServices.updateBrandServices(data, requestData?._id
      );

      if (result) {
        if (requestData?.brand_logo_key) {
          await FileUploadHelper.deleteFromSpaces(
            requestData?.brand_logo_key
          );
        }
        return sendResponse<IBrand>(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: "Brand Update Successfully !",
        });
      } else {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Brand Update Failed !");
      }
    } else {
      const requestData = req.body;

      const findBrandNameExist = await BrandModel.exists({ brand_slug: requestData?.brand_slug });
      if (findBrandNameExist && requestData?._id !== findBrandNameExist?._id.toString()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Already added!');
      }

      const findBrandSerialExist = await BrandModel.exists({
        brand_serial: requestData?.brand_serial,
      });
      if (findBrandSerialExist && requestData?._id !== findBrandSerialExist?._id.toString()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Serial Number Previously Added!');
      }

      const result: IBrand | any = await BrandServices.updateBrandServices(requestData, requestData?._id
      );
      if (result) { // ✅ Check if result is not null
        return sendResponse<IBrand>(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: "Brand Updated Successfully !",
        });
      } else {
        throw new ApiError(400, "Brand Updated Failed !");
      }

    }
  } catch (error: any) {
    next(error);
  }
});


// const updateBrandSequence = catchAsync(async (req, res) => {
//   const { brandId } = req.params;
//   const { sequence } = req.body;

//   if (sequence === undefined || isNaN(sequence)) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: StatusCodes.BAD_REQUEST,
//       message: 'Invalid sequence value',
//     });
//   }

//   const updatedBrand = await BrandServices.updateBrandSequenceInDB(brandId, Number(sequence));

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'Brand sequence updated successfully',
//     data: updatedBrand,
//   });
// });


export const BrandController = {
  postBrand,
  findAllBrand,
  findAllDashboardCategory,
  updateBrand
};