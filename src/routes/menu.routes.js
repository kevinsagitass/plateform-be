import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import {
  addMenu,
  deleteMenu,
  getAllMenu,
  getAllMenuByCategories,
  getAllMenuCategories,
  updateMenu,
} from "../controllers/menu.controller.js";
import {
  authorizeTenantAccess,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(isAuthenticated);

router.get(
  "/categories/:tenantId",
  authorizeTenantAccess((req) => req.params.tenantId),
  getAllMenuCategories,
);
router.get(
  "/:tenantId",
  authorizeTenantAccess((req) => req.params.tenantId),
  getAllMenu,
);
router.get(
  "/:tenantId/categories",
  authorizeTenantAccess((req) => req.params.tenantId),
  getAllMenuByCategories,
);
router.post(
  "/",
  upload.single("image"),
  authorizeTenantAccess((req) => req.body.tenantId),
  addMenu,
);
router.put(
  "/:id",
  upload.single("image"),
  authorizeTenantAccess((req) => req.body.tenantId),
  updateMenu,
);
router.delete(
  "/:tenantId/:id",
  authorizeTenantAccess((req) => req.params.tenantId),
  deleteMenu,
);

export default router;
