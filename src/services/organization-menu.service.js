import { db } from "../db/index.js";
import {
  organizationMenus,
  organizationMenuCategories,
  organizationAddonGroups,
  organizationAddons,
} from "../db/schema.js";
import { and, or, like, eq, count, inArray, asc, desc, ne } from "drizzle-orm";
import fs from "fs";

export const getAllMenuCategoriesData = async (organizationId) => {
  try {
    const conditions = [];
    conditions.push(
      eq(organizationMenuCategories.organizationId, organizationId)
    );
    const where = and(...conditions);

    const data = await db
      .select({
        id: organizationMenuCategories.id,
        categoryName: organizationMenuCategories.categoryName,
        orderNumber: organizationMenuCategories.orderNumber,
        isActive: organizationMenuCategories.isActive,
        createdAt: organizationMenuCategories.createdAt,
      })
      .from(organizationMenuCategories)
      .where(where)
      .orderBy(asc(organizationMenuCategories.orderNumber));

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const addCategoryData = async (categoryData) => {
  try {
    const [category] = await db
      .select()
      .from(organizationMenuCategories)
      .where(
        and(
          eq(
            organizationMenuCategories.organizationId,
            categoryData.organizationId
          ),
          or(
            eq(
              organizationMenuCategories.categoryName,
              categoryData.categoryName
            ),
            eq(organizationMenuCategories.orderNumber, categoryData.orderNumber)
          )
        )
      );

    if (category) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Category atau Order Number sudah terdaftar",
      };
    }

    const [lastCategory] = await db
      .select()
      .from(organizationMenuCategories)
      .where(
        eq(
          organizationMenuCategories.organizationId,
          categoryData.organizationId
        )
      )
      .orderBy(desc(organizationMenuCategories.orderNumber));

    const categoryId = crypto.randomUUID();

    await db.insert(organizationMenuCategories).values({
      id: categoryId,
      organizationId: categoryData.organizationId,
      categoryName: categoryData.categoryName,
      orderNumber:
        categoryData.orderNumber ?? lastCategory
          ? lastCategory.orderNumber + 1
          : 1,
      isActive: categoryData.isActive ?? true,
      createdBy: categoryData.user.id,
    });

    const [newCategory] = await db
      .select()
      .from(organizationMenuCategories)
      .where(eq(organizationMenuCategories.id, categoryId));

    return newCategory;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const updateCategoryData = async (categoryData) => {
  try {
    const [category] = await db
      .select()
      .from(organizationMenuCategories)
      .where(
        and(
          eq(
            organizationMenuCategories.organizationId,
            categoryData.organizationId
          ),
          ne(organizationMenuCategories.id, categoryData.id),
          or(
            eq(
              organizationMenuCategories.categoryName,
              categoryData.categoryName
            ),
            eq(organizationMenuCategories.orderNumber, categoryData.orderNumber)
          )
        )
      );

    if (category) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Category atau Order Number sudah terdaftar",
      };
    }

    const updateData = Object.fromEntries(
      Object.entries(categoryData).filter(
        ([_, v]) => v !== undefined && v !== ""
      )
    );

    await db
      .update(organizationMenuCategories)
      .set({
        ...updateData,
        updatedBy: categoryData.user.id,
      })
      .where(eq(organizationMenuCategories.id, categoryData.id));

    const [updatedCategory] = await db
      .select()
      .from(organizationMenuCategories)
      .where(eq(organizationMenuCategories.id, categoryData.id));

    return updatedCategory;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const deleteCategoryData = async (categoryId) => {
  try {
    const [deletedCategory] = await db
      .select()
      .from(organizationMenuCategories)
      .where(eq(organizationMenuCategories.id, categoryId));

    await db
      .delete(organizationMenuCategories)
      .where(eq(organizationMenuCategories.id, categoryId));

    return deletedCategory;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const getAllMenuData = async (menuParam) => {
  try {
    const offset = (menuParam.page - 1) * menuParam.limit;
    const conditions = [];
    if (menuParam.search) {
      conditions.push(
        or(
          like(organizationMenus.name, `%${menuParam.search}%`),
          like(organizationMenus.description, `%${menuParam.search}%`)
        )
      );
    }
    if (menuParam.categoryId) {
      conditions.push(
        eq(organizationMenus.organizationCategoryId, menuParam.categoryId)
      );
    }
    conditions.push(
      eq(organizationMenus.organizationId, menuParam.organizationId)
    );
    const where = and(...conditions);
    const menusData = await db
      .select({
        id: organizationMenus.id,
        name: organizationMenus.name,
        description: organizationMenus.description,
        imagePath: organizationMenus.imagePath,
        price: organizationMenus.price,
        discount: organizationMenus.discount,
        isActive: organizationMenus.isActive,
        isAvailable: organizationMenus.isAvailable,
        category: {
          id: organizationMenuCategories.id,
          categoryName: organizationMenuCategories.categoryName,
        },
      })
      .from(organizationMenus)
      .leftJoin(
        organizationMenuCategories,
        eq(
          organizationMenus.organizationCategoryId,
          organizationMenuCategories.id
        )
      )
      .where(where)
      .limit(menuParam.limit)
      .offset(offset);
    const menuIds = menusData.map((m) => m.id);
    const groups = await db
      .select()
      .from(organizationAddonGroups)
      .where(inArray(organizationAddonGroups.organizationMenuId, menuIds));
    const groupIds = groups.map((g) => g.id);
    const addonsData = await db
      .select()
      .from(organizationAddons)
      .where(inArray(organizationAddons.organizationAddonGroupId, groupIds));
    const [total] = await db
      .select({ count: count() })
      .from(organizationMenus)
      .where(where);
    const result = menusData.map((menu) => {
      const menuGroups = groups
        .filter((g) => g.organizationCategoryIdMenuId === menu.id)
        .map((group) => ({
          ...group,
          items: addonsData.filter(
            (addon) => addon.organizationCategoryIdAddonGroupId === group.id
          ),
        }));
      return { ...menu, organizationAddons: menuGroups };
    });
    return {
      result,
      pagination: {
        ...menuParam,
        total: total.count,
        totalPages: Math.ceil(total.count / menuParam.limit),
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const getAllMenuByCategoriesData = async (organizationId) => {
  try {
    const categories = await db
      .select({
        id: organizationMenuCategories.id,
        categoryName: organizationMenuCategories.categoryName,
        categoryOrder: organizationMenuCategories.orderNumber,
      })
      .from(organizationMenuCategories)
      .where(
        and(
          eq(organizationMenuCategories.organizationId, organizationId),
          eq(organizationMenuCategories.isActive, true)
        )
      )
      .orderBy(organizationMenuCategories.orderNumber);

    const conditions = [];

    conditions.push(eq(organizationMenus.organizationId, organizationId));
    conditions.push(eq(organizationMenus.isActive, true));

    const where = and(...conditions);

    const menusData = await db
      .select({
        id: organizationMenus.id,
        name: organizationMenus.name,
        description: organizationMenus.description,
        imagePath: organizationMenus.imagePath,
        price: organizationMenus.price,
        discount: organizationMenus.discount,
        isActive: organizationMenus.isActive,
        isAvailable: organizationMenus.isAvailable,

        categoryId: organizationMenuCategories.id,
      })
      .from(organizationMenus)
      .leftJoin(
        organizationMenuCategories,
        eq(organizationMenus.categoryId, organizationMenuCategories.id)
      )
      .where(where);

    const menuIds = menusData.map((m) => m.id);

    const groups =
      menuIds.length > 0
        ? await db
            .select()
            .from(organizationAddonGroups)
            .where(inArray(organizationAddonGroups.menuId, menuIds))
        : [];

    const groupIds = groups.map((g) => g.id);

    const addonsData =
      groupIds.length > 0
        ? await db
            .select()
            .from(organizationAddons)
            .where(inArray(organizationAddons.addonGroupId, groupIds))
        : [];

    const mappedMenus = menusData.map((menu) => {
      const menuGroups = groups
        .filter((g) => g.menuId === menu.id)
        .map((group) => ({
          ...group,
          items: addonsData.filter((addon) => addon.addonGroupId === group.id),
        }));

      return {
        id: menu.id,
        categoryId: menu.categoryId,
        name: menu.name,
        description: menu.description,
        imagePath: menu.imagePath,
        price: menu.price,
        discount: menu.discount,
        isActive: menu.isActive,
        isAvailable: menu.isAvailable,
        organizationAddons: menuGroups,
      };
    });

    const result = categories.map((category) => ({
      id: category.id,
      categoryName: category.categoryName,
      categoryOrder: category.categoryOrder,

      organizationMenus: mappedMenus.filter(
        (menu) => menu.categoryId === category.id
      ),
    }));

    return result;
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
      .from(organizationMenuCategories)
      .where(
        eq(organizationMenuCategories.id, menuData.organizationCategoryId)
      );

    if (category.length === 0) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Category tidak ditemukan",
      };
    }

    const menuId = crypto.randomUUID();

    await db.insert(organizationMenus).values({
      id: menuId,
      organizationCategoryId: menuData.organizationCategoryId,
      organizationId: menuData.organizationId,
      name: menuData.name,
      description: menuData.description,
      imagePath: menuData.imagePath,
      price: menuData.price,
      discount: menuData.discount,
      isAvailable: menuData.isAvailable,
      isActive: menuData.isActive,
      createdBy: menuData.user.id,
    });

    const [newMenu] = await db
      .select()
      .from(organizationMenus)
      .where(eq(organizationMenus.id, menuId));

    return newMenu;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const updateMenuData = async (menuData) => {
  try {
    const [existing] = await db
      .select()
      .from(organizationMenus)
      .where(eq(organizationMenus.id, menuData.id));

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
      Object.entries(menuData).filter(
        ([_, v]) => v !== undefined && v !== "" && _ !== "organizationId"
      )
    );

    await db
      .update(organizationMenus)
      .set({
        ...updateData,
        imagePath: updateData.newImagePath || existing.imagePath,
        updatedBy: menuData.user.id,
      })
      .where(eq(organizationMenus.id, menuData.id));

    const [updated] = await db
      .select()
      .from(organizationMenus)
      .where(eq(organizationMenus.id, menuData.id));

    return updated;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const deleteMenuData = async (id) => {
  try {
    const [existing] = await db
      .select()
      .from(organizationMenus)
      .where(and(eq(organizationMenus.id, id)));

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

    await db.delete(organizationMenus).where(eq(organizationMenus.id, id));

    return existing;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const getAddonGroupsByMenuData = async (organizationMenuId) => {
  try {
    const groups = await db
      .select()
      .from(organizationAddonGroups)
      .where(
        eq(organizationAddonGroups.organizationMenuId, organizationMenuId)
      );

    if (groups.length !== 0) {
      const groupIds = groups.map((g) => g.id);

      const addonsData = await db
        .select()
        .from(organizationAddons)
        .where(inArray(organizationAddons.organizationAddonGroupId, groupIds));

      const result = groups.map((group) => ({
        ...group,
        addons: addonsData.filter(
          (addon) => addon.organizationAddonGroupId === group.id
        ),
      }));

      return result;
    }

    return [];
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const addAddonGroupData = async (groupData) => {
  try {
    const [existingGroup] = await db
      .select()
      .from(organizationAddonGroups)
      .where(eq(organizationAddonGroups.name, groupData.name));

    if (existingGroup) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Group sudah terdaftar",
      };
    }

    const groupId = crypto.randomUUID();

    await db.insert(organizationAddonGroups).values({
      id: groupId,
      organizationMenuId: groupData.organizationMenuId,
      name: groupData.name,
      isRequired: groupData.isRequired,
      maxSelection: groupData.maxSelection,
      createdBy: groupData.user.id,
    });

    const [newGroup] = await db
      .select()
      .from(organizationAddonGroups)
      .where(eq(organizationAddonGroups.id, groupId));

    return newGroup;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const updateAddonGroupData = async (groupData) => {
  try {
    const [existingGroup] = await db
      .select()
      .from(organizationAddonGroups)
      .where(eq(organizationAddonGroups.id, groupData.id));

    if (!existingGroup) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Group tidak ditemukan",
      };
    }

    const updateData = Object.fromEntries(
      Object.entries(groupData).filter(
        ([_, v]) => v !== undefined && v !== "" && _ !== "id"
      )
    );

    await db
      .update(organizationAddonGroups)
      .set({
        ...updateData,
        updatedBy: groupData.user.id,
      })
      .where(eq(organizationAddonGroups.id, groupData.id));

    const [updatedGroup] = await db
      .select()
      .from(organizationAddonGroups)
      .where(eq(organizationAddonGroups.id, groupData.id));

    return updatedGroup;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const deleteAddonGroupData = async (organizationAddonGroupId) => {
  try {
    const [existingGroup] = await db
      .select()
      .from(organizationAddonGroups)
      .where(eq(organizationAddonGroups.id, organizationAddonGroupId));

    if (!existingGroup) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Group tidak ditemukan",
      };
    }

    await db
      .delete(organizationAddonGroups)
      .where(eq(organizationAddonGroups.id, organizationAddonGroupId));

    return existingGroup;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const addAddonData = async (addonData) => {
  try {
    const [existingAddon] = await db
      .select()
      .from(organizationAddons)
      .where(eq(organizationAddons.name, addonData.name));

    if (existingAddon) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Addon sudah terdaftar",
      };
    }

    const addonId = crypto.randomUUID();

    await db.insert(organizationAddons).values({
      id: addonId,
      organizationAddonGroupId: addonData.organizationAddonGroupId,
      name: addonData.name,
      isAvailable: addonData.isAvailable,
      price: addonData.price,
      createdBy: addonData.user.id,
    });

    const [newAddon] = await db
      .select()
      .from(organizationAddons)
      .where(eq(organizationAddons.id, addonId));

    return newAddon;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const updateAddonData = async (addonData) => {
  try {
    const [existingAddon] = await db
      .select()
      .from(organizationAddons)
      .where(eq(organizationAddons.id, addonData.id));

    if (!existingAddon) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Addon tidak ditemukan",
      };
    }

    const updateData = Object.fromEntries(
      Object.entries(addonData).filter(
        ([_, v]) => v !== undefined && v !== "" && _ !== "id"
      )
    );

    await db
      .update(organizationAddons)
      .set({
        ...updateData,
        updatedBy: addonData.user.id,
      })
      .where(eq(organizationAddons.id, addonData.id));

    const [updatedAddon] = await db
      .select()
      .from(organizationAddons)
      .where(eq(organizationAddons.id, addonData.id));

    return updatedAddon;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};

export const deleteAddonData = async (addonId) => {
  try {
    const [existingAddon] = await db
      .select()
      .from(organizationAddons)
      .where(eq(organizationAddons.id, addonId));

    if (!existingAddon) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Addon tidak ditemukan",
      };
    }

    await db
      .delete(organizationAddons)
      .where(eq(organizationAddons.id, addonId));

    return existingAddon;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw {
        message: err.message,
      };
    } else {
      throw err;
    }
  }
};
