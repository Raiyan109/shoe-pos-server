import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import { StatusCodes } from 'http-status-codes';
import { SettingsService } from './settings.service';
import { FileUploadHelper } from '../../middlewares/FileUploadHelper';


// const createSettings = catchAsync(async (req: Request, res: Response) => {
//   // Check if the 'data' field is a stringified JSON object
//   // let title = '';
//   // if (req.body.data) {
//   //   const parsedData = JSON.parse(req.body.data); // Parse the 'data' field
//   //   title = parsedData.title;  // Extract 'title' from the parsed object
//   // } else {
//   //   title = req.body.title; // Alternatively, if title is directly sent
//   // }
//   // // Ensure TypeScript understands req.files is an object
//   // const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//   // const favicon = files?.['favicon']?.[0]?.path;
//   // const logo = files?.['logo']?.[0]?.path;

//   // const settingsData = {
//   //   title,
//   //   favicon,
//   //   logo,
//   // };

//   if (req.files && "logo" in req.files && "favicon" in req.files && req.body) {
//     const { title } = req.body

//     let logo, logo_key;
//     let favicon, favicon_key;

//     if (req.files && "logo" in req.files && "favicon" in req.files) {
//       const logoImage = req.files["logo"][0];
//       const faviconImage = req.files["favicon"][0];

//       // Upload the logo
//       const logoUpload = await FileUploadHelper.uploadToSpaces(logoImage);
//       if (logoUpload) {
//         logo = logoUpload?.Location;
//         logo_key = logoUpload?.Key;
//       }

//       // Upload the favicon
//       const faviconUpload = await FileUploadHelper.uploadToSpaces(faviconImage);
//       if (faviconUpload) {
//         favicon = faviconUpload.Location;
//         favicon_key = faviconUpload.Key;
//       }

//       const settingsData = {
//         title,
//         favicon,
//         favicon_key,
//         logo,
//         logo_key
//       };

//       const result = await SettingsService.createSettingsIntoDB(settingsData);
//       sendResponse(res, {
//         success: true,
//         statusCode: StatusCodes.OK,
//         message: 'Settings created successfully',
//         data: result,
//       });
//     }
//   }


// });

const createSettings = catchAsync(async (req: Request, res: Response) => {
  if (!req.files || !("logo" in req.files) || !("favicon" in req.files)) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Logo and favicon are required',
    });
  }

  let title = '';
  if (req.body.data) {
    const parsedData = JSON.parse(req.body.data); // Parse the 'data' field
    title = parsedData.title;  // Extract 'title' from the parsed object
  } else {
    title = req.body.title; // Alternatively, if title is directly sent
  }
  let logo, logo_key;
  let favicon, favicon_key;

  try {
    const logoImage = req.files["logo"][0];
    const faviconImage = req.files["favicon"][0];

    const logoUpload = await FileUploadHelper.uploadToSpaces(logoImage);

    if (logoUpload) {
      logo = logoUpload?.Location;
      logo_key = logoUpload?.Key;
    }

    const faviconUpload = await FileUploadHelper.uploadToSpaces(faviconImage);

    if (faviconUpload) {
      favicon = faviconUpload.Location;
      favicon_key = faviconUpload.Key;
    }

    const settingsData = { title, favicon, favicon_key, logo, logo_key };

    const result = await SettingsService.createSettingsIntoDB(settingsData);

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Settings created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
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

const updateSettings = catchAsync(async (req: Request, res: Response) => {
  console.log("Incoming request body:", req.body);
  console.log("Incoming files:", req.files);

  let title = "";
  if (req.body.data) {
    const parsedData = JSON.parse(req.body.data);
    title = parsedData.title;
  } else {
    title = req.body.title;
  }

  // Fetch existing settings from DB to get old image keys
  const existingSettingsArray = await SettingsService.getSettingsFromDB();

  // Ensure we are working with a single settings object
  const existingSettings = existingSettingsArray?.[0];
  console.log(existingSettings, 'exisingsettings in settings controller');

  // Default values if settings don't exist
  let logo = existingSettings?.logo || "";
  let logo_key = existingSettings?.logo_key || "";
  let favicon = existingSettings?.favicon || "";
  let favicon_key = existingSettings?.favicon_key || "";
  try {
    if (req.files && "logo" in req.files) {
      const logoImage = req.files["logo"][0];

      // Delete old logo from Spaces if it exists
      if (logo_key) {
        console.log("Deleting old logo from DigitalOcean Spaces...");
        await FileUploadHelper.deleteFromSpaces(logo_key);
      }

      // Upload new logo
      console.log("Uploading new logo...");
      const logoUpload = await FileUploadHelper.uploadToSpaces(logoImage);
      if (logoUpload) {
        logo = logoUpload?.Location;
        logo_key = logoUpload?.Key;
      }
    }

    if (req.files && "favicon" in req.files) {
      const faviconImage = req.files["favicon"][0];

      // Delete old favicon from Spaces if it exists
      if (favicon_key) {
        console.log("Deleting old favicon from DigitalOcean Spaces...");
        await FileUploadHelper.deleteFromSpaces(favicon_key);
      }

      // Upload new favicon
      console.log("Uploading new favicon...");
      const faviconUpload = await FileUploadHelper.uploadToSpaces(faviconImage);
      if (faviconUpload) {
        favicon = faviconUpload.Location;
        favicon_key = faviconUpload.Key;
      }
    }

    // Prepare updated data
    const updatedSettingsData = {
      title,
      logo,
      logo_key,
      favicon,
      favicon_key,
    };

    console.log("Updating settings in database:", updatedSettingsData);
    const result = await SettingsService.updateSettingsIntoDB(updatedSettingsData);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Settings updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});




export const SettingsController = {
  createSettings,
  getSettings,
  updateSettings
};