import { getDashboardStats } from "../controllers/dashboard.controller.js";

import express from "express";
const router = express.Router();

router.get("/", getDashboardStats);

export default router;
