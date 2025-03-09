import express from 'express';

import { BrandController } from './brand.controller';

const router = express.Router();


router.post('/create', BrandController.createBrand);
router.get('/', BrandController.getAllBrands);

export const BrandRoutes = router;