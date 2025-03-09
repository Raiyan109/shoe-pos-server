import express from 'express';

import { BrandRoutes } from '../app/modules/brand/brand.route';

import { categoryRoutes } from '../app/modules/category/category.route';

import { SettingsRoutes } from '../app/modules/settings/settings.route';



const router = express.Router();

const apiRoutes = [
  // { path: '/user', route: UserRoutes },
  // { path: '/auth', route: AuthRoutes },
  // { path: '/client', route: ClientRoutes },
  // { path: '/message', route: MessageRoutes },
  // { path: '/conversation', route: ConversationRoutes },
  // { path: '/subscription', route: SubscriptionRoutes },
  { path: '/brand', route: BrandRoutes },

  { path: '/category', route: categoryRoutes },

  { path: '/settings', route: SettingsRoutes },

];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
