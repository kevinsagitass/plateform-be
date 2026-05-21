import { successResponse } from "../helpers/response.helper.js";
import { getSubscriptionConfigData } from "../services/subscription.service.js";

export const getSubscriptionConfig = async (req, res) => {
  try {
    const { plan } = req.params;
    const subscriptionConfig = await getSubscriptionConfigData(plan);

    return successResponse(res, 200, "success", subscriptionConfig);
  } catch (err) {
    throw err;
  }
};
