import { successResponse } from "../helpers/response.helper.js";
import {
  getAllUserTenantsData,
  getTenantDetailData,
} from "../services/tenant.service.js";

export const getAllUserTenants = async (req, res) => {
  try {
    const userTenants = await getAllUserTenantsData(req.user);

    return successResponse(res, 200, "success", userTenants);
  } catch (err) {
    throw err;
  }
};

export const getTenantDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantDetail = await getTenantDetailData(id);

    return successResponse(res, 200, "success", tenantDetail);
  } catch (err) {
    throw err;
  }
};
