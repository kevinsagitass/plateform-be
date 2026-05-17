import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { tenantUsers } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

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

export const authorizeTenantAccess =
  (getTenantId) => async (req, res, next) => {
    try {
      const userId = req.user.id;
      const tenantId = getTenantId(req);

      if (!tenantId) {
        return res.status(400).json({
          message: "Tenant ID is required",
        });
      }

      const access = await db
        .select()
        .from(tenantUsers)
        .where(
          and(
            eq(tenantUsers.userId, userId),
            eq(tenantUsers.tenantId, tenantId),
          ),
        )
        .limit(1);

      if (access.length === 0) {
        if (req.file) {
          await fs.unlink(req.file.path);
        }

        return res.status(403).json({
          message: "Forbidden",
        });
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
