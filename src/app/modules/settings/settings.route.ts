import express from 'express';
import { SettingsController } from './settings.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSettingsSchema, updateSettingsSchema } from './settings.validation';
const router = express.Router();

router.post('/create', validateRequest(createSettingsSchema), SettingsController.createSettings);
router.get('/', SettingsController.getSettings);
router.patch('/', SettingsController.updateSettings)

export const SettingsRoutes = router;