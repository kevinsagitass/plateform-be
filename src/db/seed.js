import "dotenv/config";
import bcrypt from "bcrypt";

import { db } from "./index.js";

import {
  organizations,
  organizationUsers,
  subscriptions,
  users,
  tenants,
  tenantUsers,
  tenantWorkHours,
  menuCategories,
  menus,
  addonGroups,
  addons,
  tables,
} from "./schema.js";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    /*
     * =========================================================
     * USERS
     * =========================================================
     */

    const hashedPassword = await bcrypt.hash("password123", 10);

    const ownerUserId = crypto.randomUUID();
    const managerUserId = crypto.randomUUID();
    const cashierUserId = crypto.randomUUID();
    const cookUserId = crypto.randomUUID();

    await db.insert(users).values([
      {
        id: ownerUserId,
        username: "kevinowner",
        name: "Kevin Owner",
        email: "owner@kfc.com",
        password: hashedPassword,
        createdBy: ownerUserId,
      },
      {
        id: managerUserId,
        username: "managerpuri",
        name: "Manager Puri",
        email: "manager@kfc.com",
        password: hashedPassword,
        createdBy: ownerUserId,
      },
      {
        id: cashierUserId,
        username: "cashierpuri",
        name: "Cashier Puri",
        email: "cashier@kfc.com",
        password: hashedPassword,
        createdBy: ownerUserId,
      },
      {
        id: cookUserId,
        username: "cookpuri",
        name: "Cook Puri",
        email: "cook@kfc.com",
        password: hashedPassword,
        createdBy: ownerUserId,
      },
    ]);

    /*
     * =========================================================
     * ORGANIZATION
     * =========================================================
     */

    const organizationId = crypto.randomUUID();

    await db.insert(organizations).values({
      id: organizationId,
      name: "KFC",
      subscriptionStatus: "ACTIVE",
      createdAt: new Date(),
      isActive: true,
    });

    /*
     * =========================================================
     * SUBSCRIPTION
     * =========================================================
     */

    await db.insert(subscriptions).values({
      id: crypto.randomUUID(),
      organizationId,
      plan: "PRO",
      status: "ACTIVE",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      createdBy: ownerUserId,
    });

    /*
     * =========================================================
     * ORGANIZATION USERS
     * =========================================================
     */

    await db.insert(organizationUsers).values({
      userId: ownerUserId,
      organizationId,
      role: "OWNER",
      createdAt: new Date(),
    });

    /*
     * =========================================================
     * TENANTS / BRANCHES
     * =========================================================
     */

    const puriTenantId = crypto.randomUUID();
    const puloTenantId = crypto.randomUUID();

    await db.insert(tenants).values([
      {
        id: puriTenantId,
        organizationId,
        tenantName: "KFC Puri",
        location: "Jakarta Barat",
        createdBy: ownerUserId,
      },
      {
        id: puloTenantId,
        organizationId,
        tenantName: "KFC Pulo Gadung",
        location: "Jakarta Timur",
        createdBy: ownerUserId,
      },
    ]);

    /*
     * =========================================================
     * TENANT USERS
     * =========================================================
     */

    await db.insert(tenantUsers).values([
      {
        userId: managerUserId,
        tenantId: puriTenantId,
        role: "STORE_MANAGER",
        createdBy: ownerUserId,
      },
      {
        userId: cashierUserId,
        tenantId: puriTenantId,
        role: "CASHIER",
        createdBy: ownerUserId,
      },
      {
        userId: cookUserId,
        tenantId: puriTenantId,
        role: "COOK",
        createdBy: ownerUserId,
      },
    ]);

    /*
     * =========================================================
     * WORK HOURS
     * =========================================================
     */

    const workHours = [];

    for (let day = 0; day < 7; day++) {
      workHours.push({
        id: crypto.randomUUID(),
        tenantId: puriTenantId,
        dayOfMonth: day,
        openHour: "09:00:00",
        closeHour: "22:00:00",
        createdBy: ownerUserId,
      });
    }

    await db.insert(tenantWorkHours).values(workHours);

    /*
     * =========================================================
     * TABLES
     * =========================================================
     */

    const tableRows = [];

    for (let i = 1; i <= 10; i++) {
      tableRows.push({
        id: crypto.randomUUID(),
        number: i,
        tenantId: puriTenantId,
        createdBy: ownerUserId,
      });
    }

    await db.insert(tables).values(tableRows);

    /*
     * =========================================================
     * MENU CATEGORY
     * =========================================================
     */

    const chickenCategoryId = crypto.randomUUID();
    const beverageCategoryId = crypto.randomUUID();
    const burgerCategoryId = crypto.randomUUID();

    await db.insert(menuCategories).values([
      {
        id: chickenCategoryId,
        categoryName: "Chicken",
        tenantId: puriTenantId,
        orderNumber: 1,
        createdBy: ownerUserId,
      },
      {
        id: burgerCategoryId,
        categoryName: "Burger",
        tenantId: puriTenantId,
        orderNumber: 2,
        createdBy: ownerUserId,
      },
      {
        id: beverageCategoryId,
        categoryName: "Beverages",
        tenantId: puriTenantId,
        orderNumber: 3,
        createdBy: ownerUserId,
      },
    ]);

    /*
     * =========================================================
     * MENUS
     * =========================================================
     */

    const chickenMenuId = crypto.randomUUID();
    const colaMenuId = crypto.randomUUID();

    await db.insert(menus).values([
      {
        id: chickenMenuId,
        categoryId: chickenCategoryId,
        tenantId: puriTenantId,
        name: "Original Chicken",
        description: "Crispy fried chicken",
        imagePath: "/images/chicken.jpg",
        price: 25000,
        discount: 0,
        createdBy: ownerUserId,
      },
      {
        id: colaMenuId,
        categoryId: beverageCategoryId,
        tenantId: puriTenantId,
        name: "Coca Cola",
        description: "Cold coca cola",
        imagePath: "/images/cola.jpg",
        price: 10000,
        discount: 0,
        createdBy: ownerUserId,
      },
    ]);

    /*
     * =========================================================
     * ADDON GROUPS
     * =========================================================
     */

    const sauceGroupId = crypto.randomUUID();

    await db.insert(addonGroups).values({
      id: sauceGroupId,
      menuId: chickenMenuId,
      name: "Sauce Selection",
      isRequired: false,
      maxSelection: 2,
      createdBy: ownerUserId,
    });

    /*
     * =========================================================
     * ADDONS
     * =========================================================
     */

    await db.insert(addons).values([
      {
        id: crypto.randomUUID(),
        addonGroupId: sauceGroupId,
        name: "BBQ Sauce",
        price: 3000,
        createdBy: ownerUserId,
      },
      {
        id: crypto.randomUUID(),
        addonGroupId: sauceGroupId,
        name: "Cheese Sauce",
        price: 5000,
        createdBy: ownerUserId,
      },
    ]);

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed");
    console.error(err);
    process.exit(1);
  }
}

seed();
