import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BrandService } from './brand.service';
import { StatusCodes } from 'http-status-codes';


const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.createBrandIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Client retrived successfully',
    data: result,
  });
});

const getAllBrands = catchAsync(async (req, res) => {
  const result = await BrandService.getAllBrandsFromDB();

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

export const BrandController = {
  createBrand,
  getAllBrands
};