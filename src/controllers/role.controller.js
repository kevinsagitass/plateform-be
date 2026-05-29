import { successResponse } from "../helpers/response.helper.js";
import {
  inviteOrganizationMemberSchema,
  removeOrganizationUserAccessSchema,
} from "../schemas/role.schema.js";
import {
  getAllOrganizationUsersRoleData,
  getAllTenantUsersRoleData,
  inviteOrganizationMemberData,
  removeOrganizationUserAccessData,
} from "../services/role.service.js";

// ===== ORGANIZATION ROLES =====

export const getAllOrganizationUsersRole = async (req, res) => {
  try {
    const { id } = req.params;
    const userOrganizations = await getAllOrganizationUsersRoleData(id);

    return successResponse(res, 200, "success", userOrganizations);
  } catch (err) {
    throw err;
  }
};

export const inviteOrganizationMember = async (req, res) => {
  try {
    const inviteParam = inviteOrganizationMemberSchema.safeParse({
      ...req.body,
      organizationId: req.params.id,
    });

    if (!inviteParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: inviteParam.error.issues[0].message,
        errors: inviteParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await inviteOrganizationMemberData({
      ...inviteParam.data,
      user: req.user,
    });

    return successResponse(res, 200, "success", result);
  } catch (error) {
    throw error;
  }
};

export const removeOrganizationUserAccess = async (req, res) => {
  try {
    const removeParam = removeOrganizationUserAccessSchema.safeParse({
      organizationId: req.params.id,
      userId: req.params.userId,
      role: req.params.role,
    });

    if (!removeParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: removeParam.error.issues[0].message,
        errors: removeParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await removeOrganizationUserAccessData({
      ...removeParam.data,
    });

    return successResponse(res, 200, "success", result);
  } catch (error) {
    throw error;
  }
};


// ===== TENANT ROLES =====

export const getAllTenantUsersRole = async (req, res) => {
  try {
    const { id } = req.params;
    const userTenants = await getAllTenantUsersRoleData(id);

    return successResponse(res, 200, "success", userTenants);
  } catch (err) {
    throw err;
  }
};