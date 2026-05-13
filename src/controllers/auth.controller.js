import { registerUserSchema } from "../config/zod.config.js";
import { successResponse } from "../helpers/response.helper.js";
import { registerUserData } from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const userParam = registerUserSchema.safeParse(req.body);

    if (!userParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: userParam.error.issues[0].message,
        errors: userParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const user = await registerUserData(userParam.data);

    return successResponse(res, 201, "success", user);
  } catch (error) {
    throw error;
  }
};
