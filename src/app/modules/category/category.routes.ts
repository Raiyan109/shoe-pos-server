import express from "express";
import {
  deleteACategoryInfo,
  findAllCategory,
  findAllDashboardCategory,
  postCategory,
  updateCategory,
} from "./category.controllers";
import { FileUploadHelper } from "../../../helpers/helpers/image.upload";
const router = express.Router();

// Create, Update, Get category
router
  .route("/")
  .get(findAllCategory)
  .post(
    FileUploadHelper.ImageUpload.fields([
      { name: "category_logo", maxCount: 1 },
    ]),
    postCategory
  )
  .patch(
    FileUploadHelper.ImageUpload.fields([
      { name: "category_logo", maxCount: 1 },
    ]),
    updateCategory
  )
  .delete(deleteACategoryInfo);

// get all category in dashboard
router.route("/dashboard").get(findAllDashboardCategory);

export const CategoryRoutes = router;
