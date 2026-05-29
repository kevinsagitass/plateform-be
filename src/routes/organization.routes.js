import express from "express";
import {
  authorizeOrganizationAccess,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";
import {
  addOrganization,
  updateOrganization,
  deleteOrganization,
  getAllUserOrganizations,
  getOrganizationDetail,
  getOrganizationUserRole,
} from "../controllers/organization.controller.js";
import { isSubscriptionActive } from "../middlewares/subscription.middleware.js";
const router = express.Router();

router.use(isAuthenticated);

router.get("/", getAllUserOrganizations);
router.get(
  "/:id",
  authorizeOrganizationAccess((req) => req.params.id, "OWNER", "ADMIN"),
  getOrganizationDetail
);
router.get(
  "/:id/role",
  authorizeOrganizationAccess((req) => req.params.id),
  getOrganizationUserRole
);
router.post(
  "/",
  isSubscriptionActive((req) => req.body.organizationId, null),
  addOrganization
);
router.patch(
  "/:id",
  isSubscriptionActive((req) => req.params.id),
  authorizeOrganizationAccess((req) => req.params.id, "OWNER"),
  updateOrganization
);
router.delete(
  "/:id",
  authorizeOrganizationAccess((req) => req.params.id, "OWNER"),
  deleteOrganization
);

export default router;
