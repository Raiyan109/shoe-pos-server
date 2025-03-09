import express from 'express';

import { CategoryController } from './category.controller';

const router = express.Router();


router.post('/create', CategoryController.createCategory);


router.get('/', CategoryController.getAllCategory);

router.patch(
    '/update/:id',
    CategoryController.updateCategory,
);

export const categoryRoutes = router;