import express from 'express';
import { SettingsController } from './settings.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { createSettingsSchema, updateSettingsSchema } from './settings.validation';
const router = express.Router();

router.post('/create', fileUploadHandler(), validateRequest(createSettingsSchema), SettingsController.createSettings);
router.get('/', SettingsController.getSettings);
router.patch('/', fileUploadHandler(), SettingsController.updateSettings)

export const SettingsRoutes = router;