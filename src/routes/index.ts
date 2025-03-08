import express from 'express';

import { BrandRoutes } from '../app/modules/brand/brand.route';


const router = express.Router();

const apiRoutes = [
  // { path: '/user', route: UserRoutes },
  // { path: '/auth', route: AuthRoutes },
  // { path: '/client', route: ClientRoutes },
  // { path: '/message', route: MessageRoutes },
  // { path: '/conversation', route: ConversationRoutes },
  // { path: '/subscription', route: SubscriptionRoutes },
  { path: '/brand', route: BrandRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
