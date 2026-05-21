import express from "express";
import passport from "passport";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { registerUser } from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";
import { successResponse } from "../helpers/response.helper.js";

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        dataStatus: "failed",
        message: info?.message || "Login gagal",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        organizationRoles: user.organizationRoles,
        tenantRoles: user.tenantRoles,
        subscription: user.subscription,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return successResponse(res, 200, "success", {
      user,
      token,
    });
  })(req, res, next);
});

router.post("/register", registerUser);

router.get("/me", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

export default router;
