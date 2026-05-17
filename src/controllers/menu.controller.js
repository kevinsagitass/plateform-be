import {
  addMenuSchema,
  searchMenuSchema,
  updateMenuSchema,
} from "../config/zod.config.js";
import { successResponse } from "../helpers/response.helper.js";
import {
  addMenuData,
  deleteMenuData,
  getAllMenuCategoriesData,
  getAllMenuData,
  getAllMenuByCategoriesData,
  updateMenuData,
} from "../services/menu.service.js";

export const getAllMenuCategories = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const menuCategories = await getAllMenuCategoriesData(tenantId);

    return successResponse(res, 200, "success", menuCategories);
  } catch (err) {
    throw err;
  }
};

export const getAllMenu = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { search, categoryId, page, limit } = req.query;

    const menuParam = searchMenuSchema.safeParse({
      search,
      tenantId,
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
    const { tenantId } = req.params;

    const menus = await getAllMenuByCategoriesData(tenantId);

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

    const addons = JSON.parse(req.body.addons);

    const menuParam = addMenuSchema.safeParse({
      ...req.body,
      addons,
      imagePath,
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

    const result = await addMenuData(menuParam.data);

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

    const addons = JSON.parse(req.body.addons);

    const { id } = req.params;

    const menuParam = updateMenuSchema.safeParse({
      id,
      ...req.body,
      addons: addons ? addons : undefined,
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

    const result = await updateMenuData(menuParam.data);

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
