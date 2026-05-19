import { successResponse } from "../helpers/response.helper.js";
import {
  addTenantSchema,
  updateTenantSchema,
} from "../schemas/tenant.schemas.js";
import {
  getAllUserTenantsData,
  getTenantDetailData,
  addTenantData,
  updateTenantData,
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

export const addTenant = async (req, res) => {
  try {
    const tenantParam = addTenantSchema.safeParse(req.body);

    if (!tenantParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: tenantParam.error.issues[0].message,
        errors: tenantParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await addTenantData({
      ...tenantParam.data,
      user: req.user,
    });

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

export const updateTenant = async (req, res) => {
  try {
    const tenantParam = updateTenantSchema.safeParse({
      tenantId: req.params.id,
      ...req.body,
    });

    if (!tenantParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: tenantParam.error.issues[0].message,
        errors: tenantParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await updateTenantData({
      ...tenantParam.data,
      user: req.user,
    });

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};
