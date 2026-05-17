import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { users, tenantUsers, organizationUsers } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          name: users.name,
          password: users.password,
        })
        .from(users)
        .where(eq(users.username, username));

      if (!user) {
        return done(null, false, { message: "User tidak ditemukan" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: "Password salah" });
      }

      const organizationRolesData = await db
        .select({
          organizationId: organizationUsers.organizationId,
          role: organizationUsers.role,
        })
        .from(organizationUsers)
        .where(eq(organizationUsers.userId, user.id));

      const tenantRolesData = await db
        .select({
          tenantId: tenantUsers.tenantId,
          role: tenantUsers.role,
        })
        .from(tenantUsers)
        .where(eq(tenantUsers.userId, user.id));

      const { password: _password, ...userWithoutPassword } = user;

      return done(null, {
        ...userWithoutPassword,
        organizationRoles: organizationRolesData,
        tenantRoles: tenantRolesData,
      });
    } catch (err) {
      console.log(err);
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  const userRoles = await db
    .select({
      tenantId: userRoles.tenantId,
      role: userRoles.role,
    })
    .from(userRoles)
    .where(eq(userRoles.userId, user.id));
  done(null, {
    ...user,
    userRoles,
  });
});

export default passport;
