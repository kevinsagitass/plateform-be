import express from "express";
import {
  getAllUserTenants,
  getTenantDetail,
} from "../controllers/tenant.controller.js";
import {
  authorizeTenantAccess,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(isAuthenticated);

router.get("/", getAllUserTenants);
router.get(
  "/:id",
  authorizeTenantAccess((req) => req.params.id),
  getTenantDetail,
);

export default router;
