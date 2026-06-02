import express from "express";
import {
  addTenant,
  updateTenant,
  getAllUserTenants,
  getTenantDetail,
  getTenantsByOrganization,
  getTenantUserRole,
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
  "/organization/:id",
  authorizeOrganizationAccess((req) => req.params.id),
  getTenantsByOrganization
);
router.get(
  "/:id",
  authorizeTenantAccess((req) => req.params.id),
  getTenantDetail
);
router.get(
  "/:id/role",
  authorizeTenantAccess((req) => req.params.id),
  getTenantUserRole
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
