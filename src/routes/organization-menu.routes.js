import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import {
  addMenu,
  deleteMenu,
  deleteCategory,
  getAllMenu,
  addAddon,
  deleteAddonGroup,
  getAddonGroups,
  getAllMenuByCategories,
  getAllMenuCategories,
  updateMenu,
  addCategory,
  addAddonGroup,
  updateCategory,
  updateAddonGroup,
  updateAddon,
  deleteAddon,
} from "../controllers/organization-menu.controller.js";
import {
  authorizeOrganizationAccess,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(isAuthenticated);

// ===== Menu Categories =====
router.get(
  "/categories/:organizationId",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  getAllMenuCategories
);
router.post(
  "/categories/:organizationId",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  addCategory
);
router.patch(
  "/categories/:organizationId",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  updateCategory
);
router.delete(
  "/categories/:organizationId/:organizationCategoryId",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  deleteCategory
);

// ===== MENUS =====
router.get(
  "/:organizationId",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  getAllMenu
);
router.get(
  "/:organizationId/categories",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  getAllMenuByCategories
);
router.post(
  "/:organizationId",
  upload.single("image"),
  authorizeOrganizationAccess((req) => req.params.organizationId),
  addMenu
);
router.patch(
  "/:organizationId/:id",
  upload.single("image"),
  authorizeOrganizationAccess((req) => req.params.organizationId),
  updateMenu
);
router.delete(
  "/:organizationId/:id",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  deleteMenu
);

// ===== ADDON GROUPS =====
router.get(
  "/:organizationId/:organizationMenuId/addon-groups",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  getAddonGroups
);
router.post(
  "/:organizationId/addon-groups",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  addAddonGroup
);
router.patch(
  "/:organizationId/addon-groups/:organizationAddonGroupId",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  updateAddonGroup
);
router.delete(
  "/:organizationId/addon-groups/:organizationAddonGroupId/",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  deleteAddonGroup
);

// ===== ADDONS =====
router.post(
  "/:organizationId/:organizationAddonGroupId/addons",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  addAddon
);
router.patch(
  "/:organizationId/:organizationAddonGroupId/addons/:addonId",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  updateAddon
);
router.delete(
  "/:organizationId/:organizationAddonGroupId/addons/:addonId",
  authorizeOrganizationAccess((req) => req.params.organizationId),
  deleteAddon
);

export default router;
