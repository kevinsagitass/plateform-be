import { db } from "../db/index.js";
import { menus, menuCategories, addonGroups, addons } from "../db/schema.js";
import { and, or, like, eq, count, inArray, asc } from "drizzle-orm";
import fs from "fs";

export const getAllMenuCategoriesData = async (tenantId) => {
  try {
    const conditions = [];
    conditions.push(eq(menuCategories.isActive, true));
    conditions.push(eq(menuCategories.tenantId, tenantId));
    const where = and(...conditions);

    const data = await db
      .select({
        id: menuCategories.id,
        categoryName: menuCategories.categoryName,
        isActive: menuCategories.isActive,
        createdAt: menuCategories.createdAt,
      })
      .from(menuCategories)
      .where(where)
      .orderBy(asc(menuCategories.orderNumber));

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
    conditions.push(eq(menus.tenantId, menuParam.tenantId));
    conditions.push(eq(menus.isActive, true));
    const where = and(...conditions);
    const menusData = await db
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
    const menuIds = menusData.map((m) => m.id);
    const groups = await db
      .select()
      .from(addonGroups)
      .where(inArray(addonGroups.menuId, menuIds));
    const groupIds = groups.map((g) => g.id);
    const addonsData = await db
      .select()
      .from(addons)
      .where(inArray(addons.addonGroupId, groupIds));
    const [total] = await db
      .select({ count: count() })
      .from(menus)
      .where(where);
    const result = menusData.map((menu) => {
      const menuGroups = groups
        .filter((g) => g.menuId === menu.id)
        .map((group) => ({
          ...group,
          items: addonsData.filter((addon) => addon.addonGroupId === group.id),
        }));
      return { ...menu, addons: menuGroups };
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
    console.log(err);
    throw { message: err.message };
  }
};

export const getAllMenuByCategoriesData = async (tenantId) => {
  try {
    const categories = await db
      .select({
        id: menuCategories.id,
        categoryName: menuCategories.categoryName,
        categoryOrder: menuCategories.orderNumber,
      })
      .from(menuCategories)
      .where(
        and(
          eq(menuCategories.tenantId, tenantId),
          eq(menuCategories.isActive, true)
        )
      )
      .orderBy(menuCategories.orderNumber);

    const conditions = [];

    conditions.push(eq(menus.tenantId, tenantId));
    conditions.push(eq(menus.isActive, true));

    const where = and(...conditions);

    const menusData = await db
      .select({
        id: menus.id,
        name: menus.name,
        description: menus.description,
        imagePath: menus.imagePath,
        price: menus.price,
        discount: menus.discount,
        isActive: menus.isActive,
        isAvailable: menus.isAvailable,

        categoryId: menuCategories.id,
      })
      .from(menus)
      .leftJoin(menuCategories, eq(menus.categoryId, menuCategories.id))
      .where(where);

    const menuIds = menusData.map((m) => m.id);

    const groups =
      menuIds.length > 0
        ? await db
            .select()
            .from(addonGroups)
            .where(inArray(addonGroups.menuId, menuIds))
        : [];

    const groupIds = groups.map((g) => g.id);

    const addonsData =
      groupIds.length > 0
        ? await db
            .select()
            .from(addons)
            .where(inArray(addons.addonGroupId, groupIds))
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
        addons: menuGroups,
      };
    });

    const result = categories.map((category) => ({
      id: category.id,
      categoryName: category.categoryName,
      categoryOrder: category.categoryOrder,

      menus: mappedMenus.filter((menu) => menu.categoryId === category.id),
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
      .from(menuCategories)
      .where(eq(menuCategories.id, menuData.categoryId));

    if (category.length === 0) {
      throw {
        status: 400,
        dataStatus: "failed",
        message: "Category tidak ditemukan",
      };
    }

    const menuId = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(menus).values({
        id: menuId,
        categoryId: menuData.categoryId,
        tenantId: menuData.tenantId,
        name: menuData.name,
        description: menuData.description,
        imagePath: menuData.imagePath,
        price: menuData.price,
        discount: menuData.discount,
        isAvailable: menuData.isAvailable,
        isActive: menuData.isActive,
      });

      for (const group of menuData.addons) {
        const addonGroupId = crypto.randomUUID();

        await tx.insert(addonGroups).values({
          id: addonGroupId,
          menuId,
          name: group.name,
          isRequired: group.isRequired,
          maxSelection: group.maxSelection,
        });

        if (group.items.length > 0) {
          await tx.insert(addons).values(
            group.items.map((item) => ({
              id: crypto.randomUUID(),
              addonGroupId,
              name: item.name,
              price: item.price,
              isAvailable: item.isAvailable,
            }))
          );
        }
      }
    });

    const [newMenu] = await db.select().from(menus).where(eq(menus.id, menuId));

    const groups = await db
      .select()
      .from(addonGroups)
      .where(eq(addonGroups.menuId, menuId));

    const groupsWithItems = await Promise.all(
      groups.map(async (group) => {
        const items = await db
          .select()
          .from(addons)
          .where(eq(addons.addonGroupId, group.id));

        return {
          ...group,
          items,
        };
      })
    );

    return {
      ...newMenu,
      addons: groupsWithItems,
    };
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
      Object.entries(menuData).filter(
        ([_, v]) => v !== undefined && v !== "" && _ != "tenantId"
      )
    );

    await db.transaction(async (tx) => {
      await tx
        .update(menus)
        .set({
          ...updateData,
          imagePath: updateData.newImagePath || existing.imagePath,
          updatedBy: menuData.user.username,
        })
        .where(eq(menus.id, menuData.id));

      if (menuData.addons) {
        const existingGroups = await tx
          .select()
          .from(addonGroups)
          .where(eq(addonGroups.menuId, menuData.id));

        const existingGroupIds = existingGroups.map((g) => g.id);

        if (existingGroupIds.length > 0) {
          await tx
            .delete(addons)
            .where(inArray(addons.addonGroupId, existingGroupIds));
        }

        await tx.delete(addonGroups).where(eq(addonGroups.menuId, menuData.id));

        for (const group of menuData.addons) {
          const addonGroupId = crypto.randomUUID();

          await tx.insert(addonGroups).values({
            id: addonGroupId,
            menuId: menuData.id,
            name: group.name,
            isRequired: group.isRequired,
            maxSelection: group.maxSelection,
          });

          if (group.items.length > 0) {
            await tx.insert(addons).values(
              group.items.map((item) => ({
                id: crypto.randomUUID(),
                addonGroupId,
                name: item.name,
                price: item.price,
                isAvailable: item.isAvailable,
              }))
            );
          }
        }
      }
    });

    const [updated] = await db
      .select()
      .from(menus)
      .where(eq(menus.id, menuData.id));

    const groups = await db
      .select()
      .from(addonGroups)
      .where(eq(addonGroups.menuId, menuData.id));

    const groupsWithItems = await Promise.all(
      groups.map(async (group) => {
        const items = await db
          .select()
          .from(addons)
          .where(eq(addons.addonGroupId, group.id));

        return {
          ...group,
          items,
        };
      })
    );

    return {
      ...updated,
      addons: groupsWithItems,
    };
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
