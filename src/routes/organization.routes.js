import express from "express";
import {
  authorizeAction,
  authorizeOrganizationAccess,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";
import {
  addOrganization,
  updateOrganization,
  deleteOrganization,
  getAllUserOrganizations,
  getOrganizationDetail,
} from "../controllers/organization.controller.js";
const router = express.Router();

router.use(isAuthenticated);

router.get("/", authorizeAction("OWNER", "ADMIN"), getAllUserOrganizations);
router.get(
  "/:id",
  authorizeOrganizationAccess((req) => req.params.id, "OWNER", "ADMIN"),
  getOrganizationDetail
);
router.post("/", authorizeAction("OWNER"), addOrganization);
router.patch(
  "/:id",
  authorizeOrganizationAccess((req) => req.params.id, "OWNER"),
  updateOrganization
);
router.delete(
  "/:id",
  authorizeOrganizationAccess((req) => req.params.id, "OWNER"),
  deleteOrganization
);

export default router;
