import { db } from "../db/index.js";
import {
  organizations,
  organizationUsers,
  subscriptions,
  tenants,
} from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { addDays } from "../helpers/date.helper.js";
import { getHighestRole } from "../helpers/role.helper.js";

export const getAllUserOrganizationsData = async (user) => {
  try {
    const organizationsData = await db
      .selectDistinct({
        organizationId: organizations.id,
        organizationName: organizations.name,
        isActive: organizations.isActive,
        totalStaff: db.$count(
          organizationUsers,
          and(
            eq(organizationUsers.organizationId, organizations.id),
            eq(organizationUsers.role, "STAFF")
          )
        ),
        totalTenant: db.$count(
          tenants,
          and(
            eq(tenants.organizationId, organizations.id),
            eq(tenants.isActive, true)
          )
        ),
      })
      .from(organizationUsers)
      .leftJoin(
        organizations,
        eq(organizationUsers.organizationId, organizations.id)
      )
      .where(eq(organizationUsers.userId, user.id));

    return organizationsData;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const getOrganizationDetailData = async (organizationId) => {
  try {
    const [organizationData] = await db
      .select({
        organizationId: organizations.id,
        organizationName: organizations.name,
        isActive: organizations.isActive,
        subscription: {
          subscriptionId: subscriptions.id,
          plan: subscriptions.plan,
          status: subscriptions.status,
          startDate: subscriptions.startDate,
          endDate: subscriptions.endDate,
        },
      })
      .from(organizations)
      .leftJoin(
        subscriptions,
        eq(organizations.id, subscriptions.organizationId)
      )
      .where(eq(organizations.id, organizationId));

    return organizationData;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const getOrganizationUserRoleData = async (organizationId, userId) => {
  try {
    const organizationRoleData = await db
      .select({
        organizationId: organizationUsers.organizationId,
        userId: organizationUsers.userId,
        role: organizationUsers.role,
      })
      .from(organizationUsers)
      .where(
        and(
          eq(organizationUsers.organizationId, organizationId),
          eq(organizationUsers.userId, userId)
        )
      );

    const roleList = organizationRoleData.map((r) => r.role);

    return getHighestRole(roleList);
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const addOrganizationData = async (data) => {
  try {
    const organizationId = crypto.randomUUID();

    await db.insert(organizations).values({
      id: organizationId,
      name: data.name,
      createdBy: data.user.id,
    });

    await db.insert(organizationUsers).values({
      organizationId: organizationId,
      userId: data.user.id,
      role: "OWNER",
    });

    const [newOrganization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId));

    return newOrganization;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const updateOrganizationData = async (data) => {
  try {
    const [existing] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, data.organizationId));

    if (!existing) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Organization tidak ditemukan",
      };
    }

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== "")
    );

    await db.transaction(async (tx) => {
      await tx
        .update(organizations)
        .set({
          ...updateData,
          updatedBy: data.user.username,
        })
        .where(eq(organizations.id, data.organizationId));

      if (data.subscription) {
        const updateSubscriptionData = Object.fromEntries(
          Object.entries(data.subscription).filter(
            ([_, v]) => v !== undefined && v !== "" && _ != "subscriptionId"
          )
        );

        await tx
          .update(subscriptions)
          .set({
            ...updateSubscriptionData,
            updatedBy: data.user.username,
          })
          .where(eq(subscriptions.organizationId, data.organizationId));
      }
    });

    const [updated] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, data.organizationId));

    const [updatedSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, data.organizationId));

    return {
      ...updated,
      subscription: updatedSubscription,
    };
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const deleteOrganizationData = async (organizationId) => {
  try {
    const [existing] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId));

    if (!existing) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Organization tidak ditemukan",
      };
    }

    const [existingSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, organizationId));

    await db.delete(organizations).where(eq(organizations.id, organizationId));

    return {
      ...existing,
      subscription: existingSubscription,
    };
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};
