import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BrandService } from './brand.service';
import { StatusCodes } from 'http-status-codes';
import { IStatus } from '../../../enums/status';
import { IBrand } from './brand.interface';


const createBrand = catchAsync(async (req: Request, res: Response) => {
  // Check if the 'data' field is a stringified JSON object
  let brand_name = '';
  let created_by = '';
  let updated_by = '';
  let brand_status: IStatus = 'Active';
  let sequence = 0;
  let brand_image_key = '1';

  if (req.body.data) {
    const parsedData = JSON.parse(req.body.data); // Parse the 'data' field
    brand_name = parsedData.brand_name;  // Extract 'title' from the parsed object
    created_by = parsedData.created_by;  // Extract 'title' from the parsed object
    updated_by = parsedData.updated_by;  // Extract 'title' from the parsed object
    brand_status = parsedData.brand_status === true ? 'InActive' : 'Active';
    sequence = parsedData.sequence;  // Extract 'title' from the parsed object
    brand_image_key = parsedData.brand_image_key;  // Extract 'title' from the parsed object
  } else {
    brand_name = req.body.brand_name;  // Extract 'title' from the parsed object
    created_by = req.body.created_by;  // Extract 'title' from the parsed object
    updated_by = req.body.updated_by;  // Extract 'title' from the parsed object
    brand_status = req.body.brand_status === true ? 'InActive' : 'Active';
    sequence = req.body.sequence;  // Extract 'title' from the parsed object
    brand_image_key = req.body.brand_image_key;  // Extract 'title' from the parsed object
  }

  // Ensure TypeScript understands req.files is an object
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const brand_image = files?.['image']?.[0]?.path;

  const brandData: IBrand = {
    brand_name,
    created_by,
    updated_by,
    sequence,
    brand_status,
    brand_image_key,
    brand_image
  };
  const result = await BrandService.createBrandIntoDB(brandData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Brand created successfully',
    data: result,
  });
});


const getAllBrands = catchAsync(async (req, res) => {
  const query = req.query
  const result = await BrandService.getAllBrandsFromDB(query);

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

const updateBrandSequence = catchAsync(async (req, res) => {
  const { brandId } = req.params;
  const { sequence } = req.body;

  if (sequence === undefined || isNaN(sequence)) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid sequence value',
    });
  }

  const updatedBrand = await BrandService.updateBrandSequenceInDB(brandId, Number(sequence));

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Brand sequence updated successfully',
    data: updatedBrand,
  });
});


export const BrandController = {
  createBrand,
  getAllBrands,
  updateBrandSequence
};