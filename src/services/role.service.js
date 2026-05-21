import { db } from "../db/index.js";
import { organizations, organizationUsers, users } from "../db/schema.js";
import { and, eq, ne } from "drizzle-orm";
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
      .where(
        and(
          eq(organizationUsers.organizationId, id),
          ne(organizationUsers.role, "STAFF")
        )
      );

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

    // ── 1. Verify token ──────────────────────────────────────────────────────
    let payload;
    try {
      payload = verifyInviteToken(token);
    } catch {
      throw { message: "Invalid or expired invitation link", status: 400 };
    }

    const { email, organizationId, role, inviterUserId } = payload;

    // ── 2. Check if user already exists ─────────────────────────────────────
    let [user] = await db.select().from(users).where(eq(users.email, email));

    if (user) {
      // User exists — just add them to the organization
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
      // ── 3. Register new user ───────────────────────────────────────────────
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

    // ── 4. Add user to organization ──────────────────────────────────────────
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
