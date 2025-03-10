import express from 'express';

import { BrandController } from './brand.controller';
import { FileUploadHelper } from '../../../helpers/helpers/image.upload';

const router = express.Router();

// Create, Get category
router
    .route("/")
    //   .get(findAllCategory)
    .post(
        FileUploadHelper.ImageUpload.fields([
            { name: "brand_logo", maxCount: 1 },
        ]),
        BrandController.postBrand
    )
//   .patch(
//     FileUploadHelper.ImageUpload.fields([
//       { name: "category_logo", maxCount: 1 },
//     ]),
//     updateCategory
//   )
//   .delete(deleteACategoryInfo);

// get all category in dashboard
// router.route("/dashboard").get(findAllDashboardCategory);

export const BrandRoutes = router;