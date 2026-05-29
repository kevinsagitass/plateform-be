import {
  addOrganizationCategorySchema,
  organizationAddAddonGroupSchema,
  organizationAddAddonSchema,
  organizationAddMenuSchema,
  organizationSearchMenuSchema,
  organizationUpdateAddonGroupSchema,
  organizationUpdateAddonSchema,
  organizationUpdateMenuSchema,
  updateOrganizationCategorySchema,
} from "../config/zod.config.js";
import { successResponse } from "../helpers/response.helper.js";
import {
  addAddonData,
  addCategoryData,
  addMenuData,
  deleteMenuData,
  deleteAddonGroupData,
  deleteCategoryData,
  getAllMenuCategoriesData,
  getAllMenuData,
  getAllMenuByCategoriesData,
  updateMenuData,
  updateCategoryData,
  addAddonGroupData,
  getAddonGroupsByMenuData,
  updateAddonGroupData,
  updateAddonData,
  deleteAddonData,
} from "../services/organization-menu.service.js";

// ===== MENU CATEGORIES =====

export const getAllMenuCategories = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const menuCategories = await getAllMenuCategoriesData(organizationId);

    return successResponse(res, 200, "success", menuCategories);
  } catch (err) {
    throw err;
  }
};

export const addCategory = async (req, res) => {
  try {
    const categoryParam = addOrganizationCategorySchema.safeParse({
      ...req.body,
      organizationId: req.params.organizationId,
    });

    if (!categoryParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: categoryParam.error.issues[0].message,
        errors: categoryParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await addCategoryData({
      ...categoryParam.data,
      user: req.user,
    });

    return successResponse(res, 201, "success", result);
  } catch (err) {
    throw err;
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryParam = updateOrganizationCategorySchema.safeParse({
      ...req.body,
      organizationId: req.params.organizationId,
    });

    if (!categoryParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: categoryParam.error.issues[0].message,
        errors: categoryParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await updateCategoryData({
      ...categoryParam.data,
      user: req.user,
    });

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const result = await deleteCategoryData(categoryId);

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

// ===== MENUS =====

export const getAllMenu = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { search, categoryId, page, limit } = req.query;

    const menuParam = organizationSearchMenuSchema.safeParse({
      search,
      organizationId,
      categoryId,
      page,
      limit,
    });

    if (!menuParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: menuParam.error.issues[0].message,
        errors: menuParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const menus = await getAllMenuData(menuParam.data);

    return successResponse(res, 200, "success", menus);
  } catch (err) {
    throw err;
  }
};

export const getAllMenuByCategories = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const menus = await getAllMenuByCategoriesData(organizationId);

    return successResponse(res, 200, "success", menus);
  } catch (err) {
    throw err;
  }
};

export const addMenu = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        dataStatus: "failed",
        message: "Gambar wajib diupload",
      });
    }

    const imagePath = req.file.path.replace(/\\/g, "/");

    const menuParam = organizationAddMenuSchema.safeParse({
      ...req.body,
      imagePath,
      organizationId: req.params.organizationId,
    });

    if (!menuParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: menuParam.error.issues[0].message,
        errors: menuParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await addMenuData({ ...menuParam.data, user: req.user });

    return successResponse(res, 201, "success", result);
  } catch (err) {
    throw err;
  }
};

export const updateMenu = async (req, res) => {
  try {
    const newImagePath = req.file
      ? req.file.path.replace(/\\/g, "/")
      : undefined;

    const { id } = req.params;

    const menuParam = organizationUpdateMenuSchema.safeParse({
      id,
      ...req.body,
      newImagePath,
    });

    if (!menuParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: menuParam.error.issues[0].message,
        errors: menuParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await updateMenuData({ ...menuParam.data, user: req.user });

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteMenuData(id);

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

// ===== ADDON GROUPS =====

export const getAddonGroups = async (req, res) => {
  try {
    const { organizationMenuId } = req.params;

    const result = await getAddonGroupsByMenuData(organizationMenuId);

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

export const addAddonGroup = async (req, res) => {
  try {
    const groupParam = organizationAddAddonGroupSchema.safeParse({
      ...req.body,
    });

    if (!groupParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: groupParam.error.issues[0].message,
        errors: groupParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await addAddonGroupData({
      ...groupParam.data,
      user: req.user,
    });

    return successResponse(res, 201, "success", result);
  } catch (err) {
    throw err;
  }
};

export const updateAddonGroup = async (req, res) => {
  try {
    const groupParam = organizationUpdateAddonGroupSchema.safeParse({
      ...req.body,
      id: req.params.organizationAddonGroupId,
    });

    if (!groupParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: groupParam.error.issues[0].message,
        errors: groupParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await updateAddonGroupData({
      ...groupParam.data,
      user: req.user,
    });

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

export const deleteAddonGroup = async (req, res) => {
  try {
    const { organizationAddonGroupId } = req.params;

    const result = await deleteAddonGroupData(organizationAddonGroupId);

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

// ===== ADDONS =====

export const addAddon = async (req, res) => {
  try {
    const addonParam = organizationAddAddonSchema.safeParse({
      ...req.body,
      organizationAddonGroupId: req.params.organizationAddonGroupId,
    });

    if (!addonParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: addonParam.error.issues[0].message,
        errors: addonParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await addAddonData({
      ...addonParam.data,
      user: req.user,
    });

    return successResponse(res, 201, "success", result);
  } catch (err) {
    throw err;
  }
};

export const updateAddon = async (req, res) => {
  try {
    const addonParam = organizationUpdateAddonSchema.safeParse({
      ...req.body,
      id: req.params.addonId,
    });

    if (!addonParam.success) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: addonParam.error.issues[0].message,
        errors: addonParam.error.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      };
    }

    const result = await updateAddonData({
      ...addonParam.data,
      user: req.user,
    });

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};

export const deleteAddon = async (req, res) => {
  try {
    const result = await deleteAddonData(req.params.addonId);

    return successResponse(res, 200, "success", result);
  } catch (err) {
    throw err;
  }
};
