import express from 'express';

import { CategoryController } from './category.controller';

const router = express.Router();


router.post('/create', CategoryController.createCategory);
router.get('/', CategoryController.getAllCategory);

export const categoryRoutes = router;