import { db } from "../db/index.js";
import {
  tenants,
  tenantWorkHours,
  tenantUsers,
  organizations,
} from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getAllUserTenantsData = async (user) => {
  try {
    const tenantsData = await db
      .select({
        tenantId: tenants.id,
        tenantName: tenants.tenantName,
        tenantLocation: tenants.location,
        isActive: tenants.isActive,
        role: tenantUsers.role,
        organization: {
          organizationId: organizations.id,
          name: organizations.name,
        },
      })
      .from(tenantUsers)
      .leftJoin(tenants, eq(tenantUsers.tenantId, tenants.id))
      .leftJoin(organizations, eq(tenants.organizationId, organizations.id))
      .where(eq(tenantUsers.userId, user.id))
      .orderBy(tenants.createdAt);

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
    const [tenantData] = await db
      .select({
        tenantId: tenants.id,
        tenantName: tenants.tenantName,
        tenantLocation: tenants.location,
        isActive: tenants.isActive,
        organization: {
          organizationId: organizations.id,
          name: organizations.name,
        },
      })
      .from(tenants)
      .leftJoin(organizations, eq(tenants.organizationId, organizations.id))
      .where(eq(tenants.id, tenantId));

    const tenantWorkHoursData = await db
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
      ...tenantData,
      tenantWorkHours: tenantWorkHoursData,
    };
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const addTenantData = async (tenantData) => {
  try {
    const tenantId = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(tenants).values({
        id: tenantId,
        organizationId: tenantData.organizationId,
        tenantName: tenantData.tenantName,
        location: tenantData.location,
        createdBy: tenantData.user.username,
      });

      if (tenantData.tenantWorkHours) {
        await tx.insert(tenantWorkHours).values(
          tenantData.tenantWorkHours.map((wh) => ({
            tenantId: tenantId,
            dayOfMonth: wh.dayOfMonth,
            openHour: wh.openHour,
            closeHour: wh.closeHour,
            createdBy: tenantData.user.username,
          }))
        );
      }
    });

    const [newTenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId));

    const newTenantWorkHours = await db
      .select()
      .from(tenantWorkHours)
      .where(eq(tenantWorkHours.tenantId, tenantId))
      .orderBy(tenantWorkHours.dayOfMonth);

    return {
      ...newTenant,
      tenantWorkHours: newTenantWorkHours,
    };
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const updateTenantData = async (tenantData) => {
  try {
    const updateData = Object.fromEntries(
      Object.entries(tenantData).filter(([_, v]) => v !== undefined && v !== "")
    );

    await db.transaction(async (tx) => {
      await tx.update(tenants).set({
        ...updateData,
        updatedBy: tenantData.user.username,
      });

      if (tenantData.tenantWorkHours && tenantData.tenantWorkHours.length > 0) {
        await Promise.all(
          tenantData.tenantWorkHours.map((wh) => {
            const updateWorkHourData = Object.fromEntries(
              Object.entries(wh).filter(([_, v]) => v !== undefined && v !== "")
            );

            return tx
              .update(tenantWorkHours)
              .set({
                ...updateWorkHourData,
                updatedBy: tenantData.user.username,
              })
              .where(eq(tenantWorkHours.id, wh.tenantWorkHourId));
          })
        );
      }
    });

    const [updatedTenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantData.tenantId));

    const updatedTenantWorkHours = await db
      .select()
      .from(tenantWorkHours)
      .where(eq(tenantWorkHours.tenantId, tenantData.tenantId))
      .orderBy(tenantWorkHours.dayOfMonth);

    return {
      ...updatedTenant,
      tenantWorkHours: updatedTenantWorkHours,
    };
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};
