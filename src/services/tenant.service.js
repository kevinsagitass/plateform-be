import { db } from "../db/index.js";
import { tenants, tenantWorkHours, tenantUsers } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

export const getAllUserTenantsData = async (user) => {
  try {
    const tenantsData = await db
      .select({
        tenantId: tenants.id,
        tenantName: tenants.tenantName,
        tenantLocation: tenants.location,
        role: tenantUsers.role,
      })
      .from(tenantUsers)
      .leftJoin(tenants, eq(tenantUsers.tenantId, tenants.id))
      .where(and(eq(tenants.isActive, true), eq(tenantUsers.userId, user.id)));

    return tenantsData;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const getTenantDetailData = async (tenantId) => {
  try {
    const [tenantsData] = await db
      .select({
        tenantId: tenants.id,
        tenantName: tenants.tenantName,
        tenantLocation: tenants.location,
        isActive: tenants.isActive,
      })
      .from(tenants)
      .where(eq(tenants.id, tenantId));

    const tenantsWorkHours = await db
      .select({
        id: tenantWorkHours.id,
        dayOfMonth: tenantWorkHours.dayOfMonth,
        openHour: tenantWorkHours.openHour,
        closeHour: tenantWorkHours.closeHour,
        isActive: tenantWorkHours.isActive,
      })
      .from(tenantWorkHours)
      .where(eq(tenantWorkHours.tenantId, tenantId))
      .orderBy(tenantWorkHours.dayOfMonth);

    return {
      ...tenantsData,
      tenantsWorkHours,
    };
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};
