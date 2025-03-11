import express from 'express';

import { BrandController } from './brand.controller';
import { FileUploadHelper } from '../../../helpers/helpers/image.upload';
import { BrandValidation } from './brand.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// Create, Get category
router
    .route("/")
    .get(BrandController.findAllBrand)
    .post(
        FileUploadHelper.ImageUpload.fields([
            { name: "brand_logo", maxCount: 1 },
        ]),
        BrandController.postBrand
    )
    .patch(
        FileUploadHelper.ImageUpload.fields([
            { name: "brand_logo", maxCount: 1 },
        ]),
        validateRequest(BrandValidation.UpdateBrandSchema),
        BrandController.updateBrand
    )
    .delete(BrandController.deleteABrandInfo);

// get all category in dashboard
router.route("/dashboard").get(BrandController.findAllDashboardCategory);

export const BrandRoutes = router;