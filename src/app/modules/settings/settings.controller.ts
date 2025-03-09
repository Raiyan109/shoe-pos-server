import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import { StatusCodes } from 'http-status-codes';
import { SettingsService } from './settings.service';


const createSettings = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body); // Contains the form fields like 'title'
  console.log(req.files); // Contains the uploaded files: 'favicon' and 'logo'

  // Check if the 'data' field is a stringified JSON object
  let title = '';
  if (req.body.data) {
    const parsedData = JSON.parse(req.body.data); // Parse the 'data' field
    title = parsedData.title;  // Extract 'title' from the parsed object
  } else {
    title = req.body.title; // Alternatively, if title is directly sent
  }
  // Ensure TypeScript understands req.files is an object
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const favicon = files?.['favicon']?.[0]?.path;
  const logo = files?.['logo']?.[0]?.path;

  const settingsData = {
    title,
    favicon,
    logo,
  };

  console.log(settingsData);


  const result = await SettingsService.createSettingsIntoDB(settingsData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Settings created successfully',
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