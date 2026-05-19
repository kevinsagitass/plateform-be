import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { users, tenantUsers, organizationUsers } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const [user] = await db
          .select({
            id: users.id,
            username: users.username,
            name: users.name,
            email: users.email,
            password: users.password,
          })
          .from(users)
          .where(eq(users.email, email));

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
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));

  const organizationRoles = await db
    .select({
      organizationId: organizationUsers.organizationId,
      role: organizationUsers.role,
    })
    .from(organizationUsers)
    .where(eq(organizationUsers.userId, user.id));

  const tenantRoles = await db
    .select({
      tenantId: tenantUsers.tenantId,
      role: tenantUsers.role,
    })
    .from(tenantUsers)
    .where(eq(tenantUsers.userId, user.id));
  done(null, {
    ...user,
    organizationRoles,
    tenantRoles,
  });
});

export default passport;
