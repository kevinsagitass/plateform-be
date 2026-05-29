import { db } from "../db/index.js";
import {
  tenants,
  tenantWorkHours,
  tenantUsers,
  organizations,
  organizationUsers,
} from "../db/schema.js";
import { and, eq, inArray, ne, or } from "drizzle-orm";
import { getHighestRole } from "../helpers/role.helper.js";

export const getAllUserTenantsData = async (user) => {
  try {
    const tenantsData = await db
      .selectDistinct({
        tenantId: tenants.id,
        tenantName: tenants.tenantName,
        tenantLocation: tenants.location,
        isActive: tenants.isActive,
        role: tenantUsers.role,
        organization: {
          organizationId: organizations.id,
          name: organizations.name,
        },
        createdAt: tenants.createdAt,
      })
      .from(organizationUsers)
      .leftJoin(
        tenants,
        eq(organizationUsers.organizationId, tenants.organizationId)
      )
      .leftJoin(organizations, eq(tenants.organizationId, organizations.id))
      .leftJoin(tenantUsers, eq(organizationUsers.userId, tenantUsers.userId))
      .where(
        or(
          eq(organizationUsers.userId, user.id),
          eq(tenantUsers.userId, user.id)
        )
      )
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

export const getTenantsByOrganizationData = async (organizationId, userId) => {
  try {
    const access = await db
      .select()
      .from(tenantUsers)
      .where(eq(tenantUsers.userId, userId));

    const organizationAccess = await db
      .selectDistinct({
        tenantId: tenants.id,
      })
      .from(organizationUsers)
      .leftJoin(
        tenants,
        eq(organizationUsers.organizationId, tenants.organizationId)
      )
      .where(eq(organizationUsers.userId, userId));

    const tenantIds = [
      ...access.map((acc) => acc.tenantId),
      ...organizationAccess.map((orgAcc) => orgAcc.tenantId),
    ];

    const tenantsData = await db
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
      .where(
        and(
          eq(tenants.organizationId, organizationId),
          tenantIds.length > 0 ? inArray(tenants.id, tenantIds) : undefined
        )
      );

    const ids = tenantsData.map((t) => t.tenantId);

    const workHoursRaw =
      ids.length > 0
        ? await db
            .select({
              tenantId: tenantWorkHours.tenantId,
              tenantWorkHourId: tenantWorkHours.id,
              dayOfMonth: tenantWorkHours.dayOfMonth,
              openHour: tenantWorkHours.openHour,
              closeHour: tenantWorkHours.closeHour,
              isActive: tenantWorkHours.isActive,
            })
            .from(tenantWorkHours)
            .where(inArray(tenantWorkHours.tenantId, ids))
            .orderBy(tenantWorkHours.dayOfMonth)
        : [];

    const workHoursByTenant = workHoursRaw.reduce((acc, wh) => {
      if (!acc[wh.tenantId]) acc[wh.tenantId] = [];
      acc[wh.tenantId].push(wh);
      return acc;
    }, {});

    const result = tenantsData.map((t) => ({
      ...t,
      tenantWorkHours: workHoursByTenant[t.tenantId] ?? [],
    }));

    return result;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const getTenantUserRoleData = async (tenantId, userId) => {
  try {
    const tenantRoleData = await db
      .select({
        tenantId: tenantUsers.tenantId,
        userId: tenantUsers.userId,
        role: tenantUsers.role,
        organizationId: organizations.id,
      })
      .from(tenantUsers)
      .leftJoin(tenants, eq(tenantUsers.tenantId, tenants.id))
      .leftJoin(organizations, eq(tenants.organizationId, organizations.id))
      .where(
        and(eq(tenantUsers.tenantId, tenantId), eq(tenantUsers.userId, userId))
      );

    const organizationRoleData = await db
      .select({
        organizationId: organizationUsers.organizationId,
        userId: organizationUsers.userId,
        role: organizationUsers.role,
      })
      .from(organizationUsers)
      .leftJoin(
        tenants,
        eq(organizationUsers.organizationId, tenants.organizationId)
      )
      .where(eq(tenants.id, tenantId));
    const roleList = [
      ...tenantRoleData.map((r) => r.role),
      ...organizationRoleData.map((r) => r.role),
    ];

    return getHighestRole(roleList);
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
        createdBy: tenantData.user.id,
      });

      if (tenantData.tenantWorkHours) {
        await tx.insert(tenantWorkHours).values(
          tenantData.tenantWorkHours.map((wh) => {
            console.log(wh);
            return {
              tenantId: tenantId,
              dayOfMonth: wh.dayOfMonth,
              openHour: wh.openHour,
              closeHour: wh.closeHour,
              isActive: wh.isActive,
              createdBy: tenantData.user.id,
            };
          })
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
      await tx
        .update(tenants)
        .set({
          ...updateData,
          updatedBy: tenantData.user.id,
        })
        .where(eq(tenants.id, tenantData.tenantId));

      if (tenantData.tenantWorkHours && tenantData.tenantWorkHours.length > 0) {
        await Promise.all(
          tenantData.tenantWorkHours.map((wh) => {
            const updateWorkHourData = Object.fromEntries(
              Object.entries(wh).filter(([_, v]) => v !== undefined && v !== "")
            );

            console.log(updateWorkHourData, wh.tenantWorkHourId);

            return tx
              .update(tenantWorkHours)
              .set({
                ...updateWorkHourData,
                updatedBy: tenantData.user.id,
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
