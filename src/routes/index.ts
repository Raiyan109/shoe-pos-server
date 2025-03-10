import express from 'express';

import { BrandRoutes } from '../app/modules/brand/brand.routes';

import { SettingsRoutes } from '../app/modules/settings/settings.route';
import { CategoryRoutes } from '../app/modules/category/category.routes';
import { AdminRegRoutes } from '../app/modules/adminRegLog/admin.routes';



const router = express.Router();

const apiRoutes = [
  // { path: '/user', route: UserRoutes },
  // { path: '/auth', route: AuthRoutes },
  // { path: '/client', route: ClientRoutes },
  // { path: '/message', route: MessageRoutes },
  // { path: '/conversation', route: ConversationRoutes },
  // { path: '/subscription', route: SubscriptionRoutes },
  { path: '/brand', route: BrandRoutes },

  { path: '/category', route: CategoryRoutes },

  { path: '/settings', route: SettingsRoutes },

  { path: '/admin', route: AdminRegRoutes },

];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
