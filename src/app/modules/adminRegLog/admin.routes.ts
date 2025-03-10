import express from "express";
import {
  deleteAAdmin,
  findAllDashboardAdminRoleAdmin,
  getMeAdmin,
  postAdmin,
  postLogAdmin,
  updateAdmin,
} from "./admin.controllers";
const router = express.Router();

// Create, Get update and delete Admin side user
router
  .route("/")
  .get(getMeAdmin)
  .post(postAdmin)
  .patch(updateAdmin)
  .delete(deleteAAdmin);

// login a Admin
router.route("/login").post(postLogAdmin).patch(updateAdmin);

// get all dashboard admin
router.route("/dashboard").get(findAllDashboardAdminRoleAdmin);

export const AdminRegRoutes = router;
