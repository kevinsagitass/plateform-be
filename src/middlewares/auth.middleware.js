import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { organizationUsers, tenants, tenantUsers } from "../db/schema.js";
import { and, eq, ne } from "drizzle-orm";

export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      dataStatus: "failed",
      message: "Silakan login terlebih dahulu",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      dataStatus: "failed",
      message: "Token tidak valid atau sudah expired",
    });
  }
};

export const isGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/dashboard");
};

export const authorizeOrganizationAccess =
  (getOrganizationId, ...roles) =>
  async (req, res, next) => {
    try {
      const user = req.user;
      const organizationId = getOrganizationId(req);

      if (!user) {
        return res.status(401).json({
          status: "failed",
          message: "Unauthorized",
        });
      }

      if (!organizationId) {
        return res.status(400).json({
          status: "failed",
          message: "Organization ID is required",
        });
      }

      const access = await db
        .select()
        .from(organizationUsers)
        .where(
          and(
            eq(organizationUsers.userId, user.id),
            eq(organizationUsers.organizationId, organizationId)
          )
        );

      if (access.length === 0) {
        // No Access in Organization Check if a Staff ?
        const staffAccess = await db
          .select()
          .from(tenantUsers)
          .leftJoin(tenants, eq(tenantUsers.tenantId, tenants.id))
          .where(
            and(
              eq(tenantUsers.userId, user.id),
              eq(tenants.organizationId, organizationId)
            )
          );

        if (staffAccess === 0) {
          // No Staff Access. Deny to Resource
          if (req.file) {
            await fs.unlink(req.file.path);
          }

          return res.status(403).json({
            status: "failed",
            message: "Forbidden",
          });
        }
      }

      if (roles.length !== 0) {
        const hasOrganizationAccess = access?.some((acc) =>
          roles.includes(acc.role)
        );

        if (!hasOrganizationAccess) {
          return res.status(403).json({
            status: "failed",
            message: "Forbidden",
          });
        }
      }

      next();
    } catch (err) {
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch {}
      }
      next(err);
    }
  };

export const authorizeTenantAccess =
  (getTenantId, ...roles) =>
  async (req, res, next) => {
    try {
      const user = req.user;
      const tenantId = getTenantId(req);

      if (!user) {
        return res.status(401).json({
          status: "failed",
          message: "Unauthorized",
        });
      }

      if (!tenantId) {
        return res.status(400).json({
          status: "failed",
          message: "Tenant ID is required",
        });
      }

      const access = await db
        .select()
        .from(tenantUsers)
        .where(
          and(
            eq(tenantUsers.userId, user.id),
            eq(tenantUsers.tenantId, tenantId)
          )
        );

      const [tenant] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, tenantId));

      const orgAccess = await db
        .select()
        .from(organizationUsers)
        .where(
          and(
            eq(organizationUsers.userId, user.id),
            eq(organizationUsers.organizationId, tenant.organizationId)
          )
        );

      if (access.length === 0) {
        if (orgAccess.length === 0) {
          if (req.file) {
            await fs.unlink(req.file.path);
          }

          return res.status(403).json({
            status: "failed",
            message: "Forbidden",
          });
        }
      }

      if (roles.length !== 0) {
        const hasOrganizationRole = orgAccess?.some((orgRole) =>
          roles.includes(orgRole.role)
        );

        const hasTenantRole = access?.some((tenantRole) =>
          roles.includes(tenantRole.role)
        );

        if (!hasTenantRole) {
          if (orgAccess?.length > 0) {
            if (!hasOrganizationRole) {
              return res.status(403).json({
                status: "failed",
                message: "Forbidden",
              });
            }
          } else {
            return res.status(403).json({
              status: "failed",
              message: "Forbidden",
            });
          }
        }
      }

      next();
    } catch (err) {
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch {}
      }
      next(err);
    }
  };
