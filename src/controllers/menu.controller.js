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
  updateMenuData,
} from "../services/menu.service.js";

export const getAllMenuCategories = async (req, res) => {
  try {
    const menuCategories = await getAllMenuCategoriesData();

    return successResponse(res, 200, "success", menuCategories);
  } catch (err) {
    throw err;
  }
};

export const getAllMenu = async (req, res) => {
  try {
    const { search, categoryId, page, limit } = req.query;

    const menuParam = searchMenuSchema.safeParse({
      search,
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

export const addMenu = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        dataStatus: "failed",
        message: "Gambar wajib diupload",
      });
    }

    const imagePath = req.file.path.replace(/\\/g, "/");

    const menuParam = addMenuSchema.safeParse({
      ...req.body,
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

    const menuParam = updateMenuSchema.safeParse({
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
