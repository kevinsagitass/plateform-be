import { successResponse } from "../helpers/response.helper.js";
import {
  addOrganizationSchema,
  updateOrganizationSchema,
} from "../schemas/organization.schemas.js";
import {
  addOrganizationData,
  updateOrganizationData,
  deleteOrganizationData,
  getAllUserOrganizationsData,
  getOrganizationDetailData,
} from "../services/organization.service.js";

export const getAllUserOrganizations = async (req, res) => {
  try {
    const userOrganizations = await getAllUserOrganizationsData(req.user);

    return successResponse(res, 200, "success", userOrganizations);
  } catch (err) {
    throw err;
  }
};

export const getOrganizationDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationDetail = await getOrganizationDetailData(id);

    return successResponse(res, 200, "success", organizationDetail);
  } catch (err) {
    throw err;
  }
};

export const addOrganization = async (req, res) => {
  try {
    const organizationParam = addOrganizationSchema.safeParse(req.body);

    if (!organizationParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: organizationParam.error.issues[0].message,
        errors: organizationParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const data = {
      ...organizationParam.data,
      user: req.user,
    };

    const result = await addOrganizationData(data);

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const data = {
      ...req.body,
      organizationId: req.params.id,
    };

    const organizationParam = updateOrganizationSchema.safeParse(data);

    if (!organizationParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: organizationParam.error.issues[0].message,
        errors: organizationParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await updateOrganizationData({
      ...organizationParam.data,
      user: req.user,
    });

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteOrganizationData(id);

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};
