import { db } from "../db/index.js";
import { menus, menuCategories } from "../db/schema.js";
import { and, or, like, eq, count } from "drizzle-orm";
import fs from "fs";

export const getAllMenuCategoriesData = async () => {
  try {
    const conditions = [];
    conditions.push(eq(menuCategories.isActive, true));
    const where = and(...conditions);

    const data = await db
      .select({
        id: menuCategories.id,
        cayegoryName: menuCategories.categoryName,
        isActive: menuCategories.isActive,
        createdAt: menuCategories.createdAt,
      })
      .from(menuCategories)
      .where(where);

    return data;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const getAllMenuData = async (menuParam) => {
  try {
    const offset = (menuParam.page - 1) * menuParam.limit;

    const conditions = [];

    if (menuParam.search) {
      conditions.push(
        or(
          like(menus.name, `%${menuParam.search}%`),
          like(menus.description, `%${menuParam.search}%`)
        )
      );
    }

    if (menuParam.categoryId) {
      conditions.push(eq(menus.categoryId, menuParam.categoryId));
    }

    conditions.push(eq(menus.isActive, true));

    const where = and(...conditions);

    const data = await db
      .select({
        id: menus.id,
        name: menus.name,
        description: menus.description,
        imagePath: menus.imagePath,
        price: menus.price,
        discount: menus.discount,
        isActive: menus.isActive,
        isAvailable: menus.isAvailable,
        category: {
          id: menuCategories.id,
          categoryName: menuCategories.categoryName,
        },
      })
      .from(menus)
      .leftJoin(menuCategories, eq(menus.categoryId, menuCategories.id))
      .where(where)
      .limit(menuParam.limit)
      .offset(offset);

    const [total] = await db
      .select({ count: count() })
      .from(menus)
      .where(where);

    return {
      data,
      pagination: {
        ...menuParam,
        total: total.count,
        totalPages: Math.ceil(total.count / menuParam.limit),
      },
    };
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const addMenuData = async (menuData) => {
  try {
    const category = await db
      .select()
      .from(menuCategories)
      .where(eq(menuCategories.id, menuData.categoryId));

    if (category.length === 0) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Category tidak ditemukan",
      };
    }

    const id = crypto.randomUUID();

    await db.insert(menus).values({
      id,
      categoryId: menuData.categoryId,
      name: menuData.name,
      description: menuData.description,
      imagePath: menuData.imagePath,
      price: menuData.price,
      discount: menuData.discount,
    });

    const [newMenu] = await db.select().from(menus).where(eq(menus.id, id));

    return newMenu;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const updateMenuData = async (menuData) => {
  try {
    const [existing] = await db
      .select()
      .from(menus)
      .where(eq(menus.id, menuData.id));

    if (!existing) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Menu tidak ditemukan",
      };
    }

    if (menuData.newImagePath && existing.imagePath) {
      if (fs.existsSync(existing.imagePath)) {
        fs.unlinkSync(existing.imagePath);
      }
    }

    const updateData = Object.fromEntries(
      Object.entries(menuData).filter(([_, v]) => v !== undefined && v !== "")
    );

    await db
      .update(menus)
      .set({
        ...updateData,
        imagePath: updateData.newImagePath,
        updatedAt: new Date(),
      })
      .where(eq(menus.id, menuData.id));

    const [updated] = await db
      .select()
      .from(menus)
      .where(eq(menus.id, menuData.id));

    return updated;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};

export const deleteMenuData = async (id) => {
  try {
    const [existing] = await db
      .select()
      .from(menus)
      .where(and(eq(menus.id, id), eq(menus.isActive, true)));

    if (!existing) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Menu tidak ditemukan",
      };
    }

    if (existing.imagePath) {
      if (fs.existsSync(existing.imagePath)) {
        fs.unlinkSync(existing.imagePath);
      }
    }

    await db
      .update(menus)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(menus.id, id));

    return existing;
  } catch (err) {
    console.log(err);
    throw {
      message: err.message,
    };
  }
};
