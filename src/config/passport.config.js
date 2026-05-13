import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { users } from "../db/schema.js";
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

      const { password: _password, ...userWithoutPassword } = user;

      return done(null, userWithoutPassword);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  done(null, user);
});

export default passport;
