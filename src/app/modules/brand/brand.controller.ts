import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BrandService } from './brand.service';


const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.createBrandIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Client retrived successfully',
    data: result,
  });
});

export const BrandController = {
  createBrand
};