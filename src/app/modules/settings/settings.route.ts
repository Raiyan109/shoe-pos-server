import express from 'express';
import { SettingsController } from './settings.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSettingsSchema, updateSettingsSchema } from './settings.validation';
import { FileUploadHelper } from '../../../helpers/helpers/image.upload';

const router = express.Router();

// get user active category and post update delete category
router.route("/").get(SettingsController.getSettings).post(FileUploadHelper.ImageUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
]), SettingsController.createSettings).patch(FileUploadHelper.ImageUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
]),
    SettingsController.updateSettings)
// .delete(CategoryController.deleteCategory)

// get all active inactive category for dashboard
// router.route("/dashboard").get(CategoryController.getAllDashboardCategory)
// router.post('/create', fileUploadHandler(), validateRequest(createSettingsSchema), SettingsController.createSettings);
// router.get('/', SettingsController.getSettings);
// router.patch('/', fileUploadHandler(), SettingsController.updateSettings)

export const SettingsRoutes = router;