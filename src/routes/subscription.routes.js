import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getSubscriptionConfig } from "../controllers/subscription.controller.js";
const router = express.Router();

router.use(isAuthenticated);

router.get("/:plan", getSubscriptionConfig);

export default router;
