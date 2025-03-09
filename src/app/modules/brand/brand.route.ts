import express from 'express';

import { BrandController } from './brand.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();


router.put('/:brandId', BrandController.updateBrandSequence);
router.post('/create', fileUploadHandler(), BrandController.createBrand);
router.get('/', BrandController.getAllBrands);

export const BrandRoutes = router;