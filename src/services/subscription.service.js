import { db } from "../db/index.js";
import { subscriptionConfig } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getSubscriptionConfigData = async (plan) => {
  try {
    const [subscriptionConfigData] = await db
      .select()
      .from(subscriptionConfig)
      .where(eq(subscriptionConfig.plan, plan));

    return subscriptionConfigData;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};
