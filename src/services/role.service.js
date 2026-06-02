import { db } from "../db/index.js";
import {
  organizations,
  organizationUsers,
  tenantUsers,
  users,
} from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { generateInviteToken } from "../helpers/inviteToken.helper.js";
import { sendInviteEmail } from "../helpers/sendOrganizationInviteMail.js";

export const getAllOrganizationUsersRoleData = async (id) => {
  try {
    const organizationsUsersRoleData = await db
      .selectDistinct({
        userId: organizationUsers.userId,
        organizationId: organizationUsers.organizationId,
        name: users.name,
        email: users.email,
        role: organizationUsers.role,
        joinedAt: organizationUsers.createdAt,
      })
      .from(organizationUsers)
      .leftJoin(users, eq(organizationUsers.userId, users.id))
      .where(eq(organizationUsers.organizationId, id));

    return organizationsUsersRoleData;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const inviteOrganizationMemberData = async (data) => {
  try {
    const { user, organizationId, email, role } = data;

    const [organization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId));

    if (!organization) {
      throw {
        status: 404,
        dataStatus: "failed",
        message: "Organization not found",
      };
    }

    const [inviter] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    if (!inviter) {
      throw { status: 404, dataStatus: "failed", message: "Inviter not found" };
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      const [alreadyMember] = await db
        .select()
        .from(organizationUsers)
        .where(
          and(
            eq(organizationUsers.userId, existingUser.id),
            eq(organizationUsers.organizationId, organizationId)
          )
        );

      if (alreadyMember) {
        throw {
          status: 400,
          dataStatus: "failed",
          message: "User is already a member of this organization",
        };
      }
    }

    const token = generateInviteToken({
      email,
      organizationId,
      role,
      inviteUserId: user.id,
    });

    const inviteUrl = `${process.env.CLIENT_URL}/organizations/invite/accept?token=${token}`;

    await sendInviteEmail({
      toEmail: email,
      inviterName: inviter.name,
      organizationName: organization.name,
      role,
      inviteUrl,
    });

    return inviteUrl;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const acceptOrganizationInviteData = async (data) => {
  try {
    const { token, username, name, password } = data;

    let payload;
    try {
      payload = verifyInviteToken(token);
    } catch {
      throw { message: "Invalid or expired invitation link", status: 400 };
    }

    const { email, organizationId, role, inviterUserId } = payload;

    let [user] = await db.select().from(users).where(eq(users.email, email));

    if (user) {
      const [alreadyMember] = await db
        .select()
        .from(organizationUsers)
        .where(
          and(
            eq(organizationUsers.userId, user.id),
            eq(organizationUsers.organizationId, organizationId)
          )
        );

      if (alreadyMember) {
        throw {
          message: "You are already a member of this organization",
          status: 409,
        };
      }
    } else {
      if (!username || !name || !password) {
        throw {
          message: "Username, name, and password are required",
          status: 400,
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserId = crypto.randomUUID();

      await db.insert(users).values({
        id: newUserId,
        username,
        name,
        email,
        password: hashedPassword,
        createdBy: inviterUserId,
        updatedBy: inviterUserId,
      });

      [user] = await db.select().from(users).where(eq(users.id, newUserId));
    }

    await db.insert(organizationUsers).values({
      userId: user.id,
      organizationId,
      role,
    });

    return { message: "Invitation accepted successfully" };
  } catch (err) {
    console.log(err);
    throw {
      status: err.status || 500,
      message: err.message || "Failed to accept invitation",
    };
  }
};

export const removeOrganizationUserAccessData = async (data) => {
  try {
    const result = await db
      .delete(organizationUsers)
      .where(
        and(
          eq(organizationUsers.organizationId, data.organizationId),
          eq(organizationUsers.userId, data.userId),
          eq(organizationUsers.role, data.role)
        )
      );

    return result;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const getAllTenantUsersRoleData = async (id) => {
  try {
    const tenantUsersRoleData = await db
      .selectDistinct({
        userId: tenantUsers.userId,
        tenantId: tenantUsers.tenantId,
        name: users.name,
        email: users.email,
        role: tenantUsers.role,
        joinedAt: tenantUsers.createdAt,
      })
      .from(tenantUsers)
      .leftJoin(users, eq(tenantUsers.userId, users.id))
      .where(eq(tenantUsers.tenantId, id));

    return tenantUsersRoleData;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const updateTenantUserAccessData = async (data) => {
  try {
    const lastRole = await db
      .select()
      .from(tenantUsers)
      .where(
        and(
          eq(tenantUsers.tenantId, data.tenantId),
          eq(tenantUsers.userId, data.userId),
          eq(tenantUsers.role, data.oldRole)
        )
      );

    if (!lastRole) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "User dengan Role tersebut tidak ditemukan",
      };
    }

    await db
      .update(tenantUsers)
      .set({
        role: data.newRole,
      })
      .where(
        and(
          eq(tenantUsers.tenantId, data.tenantId),
          eq(tenantUsers.userId, data.userId),
          eq(tenantUsers.role, data.oldRole)
        )
      );

    return lastRole;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const removeTenantUserAccessData = async (data) => {
  try {
    const result = await db
      .delete(tenantUsers)
      .where(
        and(
          eq(tenantUsers.tenantId, data.tenantId),
          eq(tenantUsers.userId, data.userId),
          eq(tenantUsers.role, data.role)
        )
      );

    return result;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};
