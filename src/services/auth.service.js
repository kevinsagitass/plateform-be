import { db } from "../db/index.js";
import bcrypt from "bcrypt";
import { subscriptions, users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const registerUserData = async (userData) => {
  try {
    const [existingUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, userData.username));

    const [existingEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email));

    if (existingUsername) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Username sudah digunakan",
      };
    } else if (existingEmail) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Email sudah digunakan",
      };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const id = crypto.randomUUID();
    const subscriptionId = crypto.randomUUID();

    const newUserData = {
      ...userData,
      id,
      password: hashedPassword,
      createdBy: "SYSTEM",
    };

    await db.insert(users).values(newUserData);

    await db.insert(subscriptions).values({
      id: subscriptionId,
      userId: id,
      plan: "BASIC",
      status: "ACTIVE",
      endDate: addDays(new Date(), 30),
      createdBy: id,
    });

    const [newUser] = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id));

    return {
      ...newUser,
    };
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};
