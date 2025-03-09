import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import { StatusCodes } from 'http-status-codes';
import { SettingsService } from './settings.service';


const createSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.createSettingsIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Settings retrived successfully',
    data: result,
  });
});


const getSettings = catchAsync(async (req, res) => {
  const result = await SettingsService.getSettingsFromDB();

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
    message: 'Settings retrieved successfully',
    data: result,
  });
});

export const SettingsController = {
  createSettings,
  getSettings
};