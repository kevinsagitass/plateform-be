import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import {
  addMenu,
  deleteMenu,
  getAllMenu,
  getAllMenuCategories,
  updateMenu,
} from "../controllers/menu.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(isAuthenticated);

router.get("/categories", getAllMenuCategories);
router.get("/", getAllMenu);
router.post("/", upload.single("image"), addMenu);
router.put("/", upload.single("image"), updateMenu);
router.delete("/:id", deleteMenu);

export default router;
