import express from "express";
import {
  authorizeOrganizationAccess,
  authorizeTenantAccess,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";
import {
  getAllOrganizationUsersRole,
  getAllTenantUsersRole,
  inviteOrganizationMember,
  removeOrganizationUserAccess,
} from "../controllers/role.controller.js";
import { isSubscriptionActive } from "../middlewares/subscription.middleware.js";
const router = express.Router();

router.use(isAuthenticated);

// ===== ORGANIZATION ROLES =====
router.get(
  "/organizations/:id",
  authorizeOrganizationAccess((req) => req.params.id, "OWNER", "ADMIN"),
  getAllOrganizationUsersRole
);

router.post(
  "/organizations/:id/invite",
  isSubscriptionActive((req) => req.params.id, null),
  authorizeOrganizationAccess((req) => req.params.id, "OWNER"),
  inviteOrganizationMember
);

// ===== TENANT ROLES =====

router.get(
  "/tenants/:id",
  authorizeTenantAccess(
    (req) => req.params.id,
    "OWNER",
    "ADMIN",
    "STORE_MANAGER"
  ),
  getAllTenantUsersRole
);

router.post("/organizations/invite/accept", async (req, res) => {
  try {
    const { token, username, name, password } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    const result = await acceptInviteData({ token, username, name, password });
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.delete(
  "/organizations/:id/:userId/:role",
  isSubscriptionActive((req) => req.params.id, null),
  removeOrganizationUserAccess
);

export default router;
