import express from 'express';
import { SettingsController } from './settings.controller';
const router = express.Router();


router.post('/create', SettingsController.createSettings);
router.get('/', SettingsController.getSettings);

export const SettingsRoutes = router;