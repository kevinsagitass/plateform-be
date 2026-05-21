import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { organizations, subscriptions, tenants } from "../db/schema.js";

export const isSubscriptionActive =
  (getOrganizationId = null, getTenantId = null) =>
  async (req, res, next) => {
    try {
      const user = req.user;
      const organizationId = getOrganizationId ? getOrganizationId(req) : null;
      const tenantId = getTenantId ? getTenantId(req) : null;

      if (!user) {
        return res.status(401).json({
          status: "failed",
          message: "Unauthorized",
        });
      }

      if (organizationId || tenantId) {
        // Organization or Tenant Id Exists check by Resource
        if (organizationId) {
          // Organization ID Available Check by Organization
          const [subscriptionData] = await db
            .select({
              userId: subscriptions.userId,
              plan: subscriptions.plan,
              status: subscriptions.status,
            })
            .from(organizations)
            .leftJoin(
              subscriptions,
              eq(organizations.createdBy, subscriptions.userId)
            )
            .where(eq(organizations.id, organizationId));

          if (!subscriptionData || subscriptionData.status != "ACTIVE") {
            if (req.file) {
              await fs.unlink(req.file.path);
            }
            return res.status(403).json({
              status: "failed",
              message: "Subscription is not Active",
            });
          }
        } else {
          // Only Tenant ID Available Check by Tenant First
          const [subscriptionData] = await db
            .select({
              userId: subscriptions.userId,
              plan: subscriptions.plan,
              status: subscriptions.status,
            })
            .from(tenants)
            .leftJoin(organizations)
            .leftJoin(
              subscriptions,
              eq(organizations.createdBy, subscriptions.userId)
            )
            .where(eq(tenants.id, tenantId));

          if (!subscriptionData || subscriptionData.status != "ACTIVE") {
            if (req.file) {
              await fs.unlink(req.file.path);
            }
            return res.status(403).json({
              status: "failed",
              message: "Subscription is not Active",
            });
          }
        }
      } else {
        // No Resource Access {Add New Organization} Check by User
        const [subscriptionData] = await db
          .select({
            userId: subscriptions.userId,
            plan: subscriptions.plan,
            status: subscriptions.status,
          })
          .from(subscriptions)
          .where(eq(subscriptions.userId, req.user.id));

        if (!subscriptionData || subscriptionData.status != "ACTIVE") {
          if (req.file) {
            await fs.unlink(req.file.path);
          }
          return res.status(403).json({
            status: "failed",
            message: "Subscription is not Active",
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
