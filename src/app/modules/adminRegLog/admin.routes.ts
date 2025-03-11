import express from "express";
import {
  AdminControllers,
} from "./admin.controllers";
const router = express.Router();

// Create, Get update and delete Admin side user
router
  .route("/")
  //.get(getMeAdmin)
  .post(AdminControllers.registerAdmin)
  //.patch(updateAdmin)
  //.delete(deleteAAdmin);

// login a Admin
router.route("/login").post(AdminControllers.loginAdmin)//.patch(updateAdmin);

// get all dashboard admin
//router.route("/dashboard").get(findAllDashboardAdminRoleAdmin);

export const AdminRegRoutes = router;
