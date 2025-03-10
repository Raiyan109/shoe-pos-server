import { NextFunction, Request, Response } from 'express';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiError';
import config from '../../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// // Upload file to Cloudinary and delete from local
// const sendImageToCloudinary = (filePath: string, fileName: string): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(filePath, { public_id: fileName.trim() }, (error, result) => {
//       if (error) return reject(error);
//       if (result) {
//         fs.unlink(filePath, (err) => {
//           if (err) console.log('Error deleting file:', err);
//         });
//         resolve(result);
//       }
//     });
//   });
// };


// // Multer storage: temporary save to uploads/
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(process.cwd(), 'uploads');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const fileExt = path.extname(file.originalname);
//     const fileName = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
//     cb(null, fileName + fileExt);
//   },
// });

// // Multer upload middleware
// const upload = multer({ storage }).fields([
//   { name: 'image', maxCount: 3 },
//   { name: 'media', maxCount: 3 },
//   { name: 'doc', maxCount: 3 },
//   { name: 'favicon', maxCount: 3 },
//   { name: 'logo', maxCount: 3 },
// ]);

// // Middleware to handle file upload and Cloudinary upload
// const fileUploadHandler = (req: Request, res: Response, next: NextFunction) => {
//   upload(req, res, async (err: any) => {
//     if (err) {
//       return next(new ApiError(StatusCodes.BAD_REQUEST, 'File upload failed'));
//     }

//     try {
//       const uploadedFiles: Record<string, string[]> = {}; // Store uploaded URLs

//       for (const fieldName of ['image', 'media', 'doc', 'favicon', 'logo']) {
//         if (req.files && (req.files as any)[fieldName]) {
//           uploadedFiles[fieldName] = [];

//           for (const file of (req.files as any)[fieldName]) {
//             const cloudinaryResult = await sendImageToCloudinary(file.path, file.filename);
//             uploadedFiles[fieldName].push(cloudinaryResult.secure_url);
//           }
//         }
//       }

//       res.status(StatusCodes.OK).json({ message: 'Files uploaded successfully', data: uploadedFiles });
//     } catch (error) {
//       next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error uploading to Cloudinary'));
//     }
//   });
// };

// export default fileUploadHandler;


const fileUploadHandler = () => {
  //create upload folder
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  //folder create for different file
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  //create filename
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      switch (file.fieldname) {
        case 'image':
          uploadDir = path.join(baseUploadDir, 'images');
          break;
        case 'media':
          uploadDir = path.join(baseUploadDir, 'medias');
          break;
        case 'doc':
          uploadDir = path.join(baseUploadDir, 'docs');
          break;
        case 'favicon':
          uploadDir = path.join(baseUploadDir, 'images');
          break;
        case 'logo':
          uploadDir = path.join(baseUploadDir, 'images');
          break;
        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, 'File is not supported');
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  //file filter
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (file.fieldname === 'image') {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg file supported'
          )
        );
      }
    } else if (file.fieldname === 'media') {
      if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/mpeg') {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .mp4, .mp3, file supported'
          )
        );
      }
    } else if (file.fieldname === 'doc') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only pdf supported'));
      }
    } else if (file.fieldname === 'favicon') {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg file supported'
          )
        );
      }
    } else if (file.fieldname === 'logo') {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg file supported'
          )
        );
      }
    }
    else {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This file is not supported');
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
  }).fields([
    { name: 'image', maxCount: 3 },
    { name: 'media', maxCount: 3 },
    { name: 'doc', maxCount: 3 },
    { name: 'favicon', maxCount: 3 },
    { name: 'logo', maxCount: 3 },
  ]);
  return upload;
};

export default fileUploadHandler;
