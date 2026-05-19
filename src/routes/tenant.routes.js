import express from "express";
import {
  addTenant,
  updateTenant,
  getAllUserTenants,
  getTenantDetail,
} from "../controllers/tenant.controller.js";
import {
  authorizeOrganizationAccess,
  authorizeTenantAccess,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(isAuthenticated);

router.get("/", getAllUserTenants);
router.get(
  "/:id",
  authorizeTenantAccess((req) => req.params.id),
  getTenantDetail
);
router.post(
  "/",
  authorizeOrganizationAccess(
    (req) => req.body.organizationId,
    "OWNER",
    "ADMIN"
  ),
  addTenant
);
router.patch(
  "/:id",
  authorizeTenantAccess(
    (req) => req.params.id,
    "OWNER",
    "ADMIN",
    "STORE_MANAGER"
  ),
  updateTenant
);

export default router;
