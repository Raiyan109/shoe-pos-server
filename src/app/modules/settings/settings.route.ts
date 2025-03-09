import express from 'express';
import { SettingsController } from './settings.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();


router.post('/create', fileUploadHandler(), SettingsController.createSettings);
router.get('/', SettingsController.getSettings);

export const SettingsRoutes = router;