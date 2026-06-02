import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import * as schema from "./schema.js";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "plateform",
});

const db = drizzle(connection, { schema, mode: "default" });

async function seed() {
  console.log("🌱 Starting seed...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // ==================== SUBSCRIPTION CONFIG ====================
  console.log("📦 Seeding subscription config...");
  await db.insert(schema.subscriptionConfig).values([
    { plan: "FREE", maxOrganization: 1, maxTenant: 1 },
    { plan: "BASIC", maxOrganization: 3, maxTenant: 5 },
    { plan: "PRO", maxOrganization: 10, maxTenant: 20 },
    { plan: "ENTERPRISE", maxOrganization: 100, maxTenant: 500 },
  ]);

  // ==================== USERS ====================
  console.log("👤 Seeding users...");

  const adminId = crypto.randomUUID();
  const ownerId = crypto.randomUUID();
  const managerId = crypto.randomUUID();
  const cashierId = crypto.randomUUID();
  const cookId = crypto.randomUUID();

  // Insert admin first (self-reference workaround)
  await db.insert(schema.users).values({
    id: adminId,
    username: "superadmin",
    name: "Super Admin",
    email: "superadmin@example.com",
    password: hashedPassword,
    createdBy: adminId,
    updatedBy: adminId,
  });

  await db.insert(schema.users).values([
    {
      id: ownerId,
      username: "owner1",
      name: "Owner Satu",
      email: "owner1@example.com",
      password: hashedPassword,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      id: managerId,
      username: "manager1",
      name: "Manager Satu",
      email: "manager1@example.com",
      password: hashedPassword,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      id: cashierId,
      username: "cashier1",
      name: "Cashier Satu",
      email: "cashier1@example.com",
      password: hashedPassword,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      id: cookId,
      username: "cook1",
      name: "Cook Satu",
      email: "cook1@example.com",
      password: hashedPassword,
      createdBy: adminId,
      updatedBy: adminId,
    },
  ]);

  // ==================== SUBSCRIPTIONS ====================
  console.log("💳 Seeding subscriptions...");

  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  await db.insert(schema.subscriptions).values([
    {
      id: crypto.randomUUID(),
      userId: adminId,
      plan: "ENTERPRISE",
      status: "ACTIVE",
      startDate: now,
      endDate: oneYearLater,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      id: crypto.randomUUID(),
      userId: ownerId,
      plan: "PRO",
      status: "ACTIVE",
      startDate: now,
      endDate: oneYearLater,
      createdBy: adminId,
      updatedBy: adminId,
    },
  ]);

  // ==================== ORGANIZATIONS ====================
  console.log("🏢 Seeding organizations...");

  const org1Id = crypto.randomUUID();
  const org2Id = crypto.randomUUID();

  await db.insert(schema.organizations).values([
    {
      id: org1Id,
      name: "Restoran Nusantara Group",
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: org2Id,
      name: "Kafe Kopi Kenangan Group",
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== ORGANIZATION USERS ====================
  // Role hanya: OWNER | ADMIN (tidak ada STAFF di schema baru)
  console.log("👥 Seeding organization users...");

  await db.insert(schema.organizationUsers).values([
    {
      userId: ownerId,
      organizationId: org1Id,
      role: "OWNER",
    },
    {
      userId: managerId,
      organizationId: org1Id,
      role: "ADMIN",
    },
    {
      userId: ownerId,
      organizationId: org2Id,
      role: "OWNER",
    },
    {
      userId: managerId,
      organizationId: org2Id,
      role: "ADMIN",
    },
  ]);

  // ==================== TENANTS ====================
  console.log("🏪 Seeding tenants...");

  const tenant1Id = crypto.randomUUID();
  const tenant2Id = crypto.randomUUID();
  const tenant3Id = crypto.randomUUID();

  await db.insert(schema.tenants).values([
    {
      id: tenant1Id,
      organizationId: org1Id,
      tenantName: "Restoran Nusantara - Pusat",
      location: "Jl. Sudirman No. 1, Jakarta Pusat",
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: tenant2Id,
      organizationId: org1Id,
      tenantName: "Restoran Nusantara - Selatan",
      location: "Jl. TB Simatupang No. 10, Jakarta Selatan",
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: tenant3Id,
      organizationId: org2Id,
      tenantName: "Kafe Kopi Kenangan - Utama",
      location: "Jl. Gatot Subroto No. 5, Jakarta",
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== TENANT USERS ====================
  // Role: STORE_MANAGER | CASHIER | COOK
  // Sekarang punya auditColumns (createdBy, updatedBy)
  console.log("👨‍💼 Seeding tenant users...");

  await db.insert(schema.tenantUsers).values([
    {
      userId: managerId,
      tenantId: tenant1Id,
      role: "STORE_MANAGER",
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      userId: cashierId,
      tenantId: tenant1Id,
      role: "CASHIER",
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      userId: cookId,
      tenantId: tenant1Id,
      role: "COOK",
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      userId: managerId,
      tenantId: tenant2Id,
      role: "STORE_MANAGER",
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      userId: cashierId,
      tenantId: tenant3Id,
      role: "CASHIER",
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      userId: cookId,
      tenantId: tenant3Id,
      role: "COOK",
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== TENANT WORK HOURS ====================
  console.log("🕐 Seeding tenant work hours...");

  const workHours = [];

  // Tenant 1 - buka setiap hari (1-7, Senin-Minggu)
  for (let day = 1; day <= 7; day++) {
    workHours.push({
      id: crypto.randomUUID(),
      tenantId: tenant1Id,
      dayOfMonth: day,
      openHour: "08:00:00",
      closeHour: "22:00:00",
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    });
  }

  // Tenant 2 - buka Senin-Jumat (1-5)
  for (let day = 1; day <= 5; day++) {
    workHours.push({
      id: crypto.randomUUID(),
      tenantId: tenant2Id,
      dayOfMonth: day,
      openHour: "09:00:00",
      closeHour: "21:00:00",
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    });
  }

  // Tenant 3 - buka setiap hari
  for (let day = 1; day <= 7; day++) {
    workHours.push({
      id: crypto.randomUUID(),
      tenantId: tenant3Id,
      dayOfMonth: day,
      openHour: "07:00:00",
      closeHour: "23:00:00",
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    });
  }

  await db.insert(schema.tenantWorkHours).values(workHours);

  // ==================== ORGANIZATION MENU CATEGORIES ====================
  // Kategori di level organisasi (baru di schema ini)
  console.log("📋 Seeding organization menu categories...");

  const orgCat1Id = crypto.randomUUID(); // Makanan Utama - Org 1
  const orgCat2Id = crypto.randomUUID(); // Minuman - Org 1
  const orgCat3Id = crypto.randomUUID(); // Dessert - Org 1
  const orgCat4Id = crypto.randomUUID(); // Kopi - Org 2
  const orgCat5Id = crypto.randomUUID(); // Non-Kopi - Org 2

  await db.insert(schema.organizationMenuCategories).values([
    // Org 1 categories
    {
      id: orgCat1Id,
      categoryName: "Makanan Utama",
      organizationId: org1Id,
      orderNumber: 1,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: orgCat2Id,
      categoryName: "Minuman",
      organizationId: org1Id,
      orderNumber: 2,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: orgCat3Id,
      categoryName: "Dessert",
      organizationId: org1Id,
      orderNumber: 3,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Org 2 categories
    {
      id: orgCat4Id,
      categoryName: "Kopi",
      organizationId: org2Id,
      orderNumber: 1,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: orgCat5Id,
      categoryName: "Non-Kopi",
      organizationId: org2Id,
      orderNumber: 2,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== ORGANIZATION MENUS ====================
  // Menu di level organisasi (baru di schema ini)
  console.log("🍽️ Seeding organization menus...");

  const orgMenu1Id = crypto.randomUUID(); // Nasi Goreng Spesial
  const orgMenu2Id = crypto.randomUUID(); // Mie Ayam Bakso
  const orgMenu3Id = crypto.randomUUID(); // Ayam Bakar Madu
  const orgMenu4Id = crypto.randomUUID(); // Es Teh Manis
  const orgMenu5Id = crypto.randomUUID(); // Jus Alpukat
  const orgMenu6Id = crypto.randomUUID(); // Es Krim Coklat
  const orgMenu7Id = crypto.randomUUID(); // Americano
  const orgMenu8Id = crypto.randomUUID(); // Matcha Latte

  await db.insert(schema.organizationMenus).values([
    // Makanan Utama - Org 1
    {
      id: orgMenu1Id,
      organizationCategoryId: orgCat1Id,
      organizationId: org1Id,
      name: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan telur, ayam, dan sayuran segar",
      imagePath: "/images/nasi-goreng.jpg",
      price: 35000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: orgMenu2Id,
      organizationCategoryId: orgCat1Id,
      organizationId: org1Id,
      name: "Mie Ayam Bakso",
      description: "Mie ayam dengan bakso sapi pilihan dan kuah kaldu",
      imagePath: "/images/mie-ayam.jpg",
      price: 28000,
      discount: 5000,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: orgMenu3Id,
      organizationCategoryId: orgCat1Id,
      organizationId: org1Id,
      name: "Ayam Bakar Madu",
      description: "Ayam bakar dengan bumbu madu dan rempah pilihan",
      imagePath: "/images/ayam-bakar.jpg",
      price: 45000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Minuman - Org 1
    {
      id: orgMenu4Id,
      organizationCategoryId: orgCat2Id,
      organizationId: org1Id,
      name: "Es Teh Manis",
      description: "Teh manis segar dengan es batu",
      imagePath: "/images/es-teh.jpg",
      price: 8000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: orgMenu5Id,
      organizationCategoryId: orgCat2Id,
      organizationId: org1Id,
      name: "Jus Alpukat",
      description: "Jus alpukat segar dengan susu dan madu",
      imagePath: "/images/jus-alpukat.jpg",
      price: 18000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Dessert - Org 1
    {
      id: orgMenu6Id,
      organizationCategoryId: orgCat3Id,
      organizationId: org1Id,
      name: "Es Krim Coklat",
      description: "Es krim coklat premium dengan topping sprinkle",
      imagePath: "/images/es-krim.jpg",
      price: 22000,
      discount: 2000,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Kopi - Org 2
    {
      id: orgMenu7Id,
      organizationCategoryId: orgCat4Id,
      organizationId: org2Id,
      name: "Americano",
      description: "Espresso dengan air panas, rasa kopi yang kuat",
      imagePath: "/images/americano.jpg",
      price: 25000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Non-Kopi - Org 2
    {
      id: orgMenu8Id,
      organizationCategoryId: orgCat5Id,
      organizationId: org2Id,
      name: "Matcha Latte",
      description: "Matcha premium dengan susu oat yang creamy",
      imagePath: "/images/matcha-latte.jpg",
      price: 32000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== ORGANIZATION ADDON GROUPS ====================
  console.log("➕ Seeding organization addon groups...");

  const orgAddonGroup1Id = crypto.randomUUID(); // Pilihan Protein - Nasi Goreng
  const orgAddonGroup2Id = crypto.randomUUID(); // Tingkat Kepedasan - Nasi Goreng
  const orgAddonGroup3Id = crypto.randomUUID(); // Pilihan Susu - Americano
  const orgAddonGroup4Id = crypto.randomUUID(); // Ukuran - Americano

  await db.insert(schema.organizationAddonGroups).values([
    {
      id: orgAddonGroup1Id,
      organizationMenuId: orgMenu1Id,
      name: "Pilihan Protein",
      isRequired: true,
      maxSelection: 1,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: orgAddonGroup2Id,
      organizationMenuId: orgMenu1Id,
      name: "Tingkat Kepedasan",
      isRequired: false,
      maxSelection: 1,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: orgAddonGroup3Id,
      organizationMenuId: orgMenu7Id,
      name: "Pilihan Susu",
      isRequired: false,
      maxSelection: 1,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: orgAddonGroup4Id,
      organizationMenuId: orgMenu7Id,
      name: "Ukuran",
      isRequired: true,
      maxSelection: 1,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== ORGANIZATION ADDONS ====================
  console.log("🧩 Seeding organization addons...");

  await db.insert(schema.organizationAddons).values([
    // Pilihan Protein - Nasi Goreng
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup1Id,
      name: "Ayam",
      price: 0,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup1Id,
      name: "Udang",
      price: 8000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup1Id,
      name: "Sapi",
      price: 10000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Tingkat Kepedasan - Nasi Goreng
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup2Id,
      name: "Tidak Pedas",
      price: 0,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup2Id,
      name: "Pedas Sedang",
      price: 0,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup2Id,
      name: "Pedas Banget",
      price: 0,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Pilihan Susu - Americano
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup3Id,
      name: "Susu Sapi",
      price: 5000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup3Id,
      name: "Susu Oat",
      price: 8000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup3Id,
      name: "Susu Almond",
      price: 10000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Ukuran - Americano
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup4Id,
      name: "Small",
      price: 0,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup4Id,
      name: "Medium",
      price: 5000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      organizationAddonGroupId: orgAddonGroup4Id,
      name: "Large",
      price: 10000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== MENU CATEGORIES (Tenant Level) ====================
  console.log("📋 Seeding tenant menu categories...");

  const cat1Id = crypto.randomUUID(); // Makanan Utama - Tenant 1
  const cat2Id = crypto.randomUUID(); // Minuman - Tenant 1
  const cat3Id = crypto.randomUUID(); // Dessert - Tenant 1
  const cat4Id = crypto.randomUUID(); // Kopi - Tenant 3
  const cat5Id = crypto.randomUUID(); // Non-Kopi - Tenant 3

  await db.insert(schema.menuCategories).values([
    // Tenant 1 categories
    {
      id: cat1Id,
      categoryName: "Makanan Utama",
      tenantId: tenant1Id,
      orderNumber: 1,
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: cat2Id,
      categoryName: "Minuman",
      tenantId: tenant1Id,
      orderNumber: 2,
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: cat3Id,
      categoryName: "Dessert",
      tenantId: tenant1Id,
      orderNumber: 3,
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    // Tenant 3 categories
    {
      id: cat4Id,
      categoryName: "Kopi",
      tenantId: tenant3Id,
      orderNumber: 1,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: cat5Id,
      categoryName: "Non-Kopi",
      tenantId: tenant3Id,
      orderNumber: 2,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== MENUS (Tenant Level) ====================
  console.log("🍽️ Seeding tenant menus...");

  const menu1Id = crypto.randomUUID();
  const menu2Id = crypto.randomUUID();
  const menu3Id = crypto.randomUUID();
  const menu4Id = crypto.randomUUID();
  const menu5Id = crypto.randomUUID();
  const menu6Id = crypto.randomUUID();
  const menu7Id = crypto.randomUUID();
  const menu8Id = crypto.randomUUID();

  await db.insert(schema.menus).values([
    // Makanan Utama - Tenant 1
    {
      id: menu1Id,
      categoryId: cat1Id,
      tenantId: tenant1Id,
      name: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan telur, ayam, dan sayuran segar",
      imagePath: "/images/nasi-goreng.jpg",
      price: 35000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: menu2Id,
      categoryId: cat1Id,
      tenantId: tenant1Id,
      name: "Mie Ayam Bakso",
      description: "Mie ayam dengan bakso sapi pilihan dan kuah kaldu",
      imagePath: "/images/mie-ayam.jpg",
      price: 28000,
      discount: 5000,
      isAvailable: true,
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: menu3Id,
      categoryId: cat1Id,
      tenantId: tenant1Id,
      name: "Ayam Bakar Madu",
      description: "Ayam bakar dengan bumbu madu dan rempah pilihan",
      imagePath: "/images/ayam-bakar.jpg",
      price: 45000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    // Minuman - Tenant 1
    {
      id: menu4Id,
      categoryId: cat2Id,
      tenantId: tenant1Id,
      name: "Es Teh Manis",
      description: "Teh manis segar dengan es batu",
      imagePath: "/images/es-teh.jpg",
      price: 8000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: menu5Id,
      categoryId: cat2Id,
      tenantId: tenant1Id,
      name: "Jus Alpukat",
      description: "Jus alpukat segar dengan susu dan madu",
      imagePath: "/images/jus-alpukat.jpg",
      price: 18000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    // Dessert - Tenant 1
    {
      id: menu6Id,
      categoryId: cat3Id,
      tenantId: tenant1Id,
      name: "Es Krim Coklat",
      description: "Es krim coklat premium dengan topping sprinkle",
      imagePath: "/images/es-krim.jpg",
      price: 22000,
      discount: 2000,
      isAvailable: true,
      isActive: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    // Kopi - Tenant 3
    {
      id: menu7Id,
      categoryId: cat4Id,
      tenantId: tenant3Id,
      name: "Americano",
      description: "Espresso dengan air panas, rasa kopi yang kuat",
      imagePath: "/images/americano.jpg",
      price: 25000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Non-Kopi - Tenant 3
    {
      id: menu8Id,
      categoryId: cat5Id,
      tenantId: tenant3Id,
      name: "Matcha Latte",
      description: "Matcha premium dengan susu oat yang creamy",
      imagePath: "/images/matcha-latte.jpg",
      price: 32000,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== ADDON GROUPS (Tenant Level) ====================
  console.log("➕ Seeding tenant addon groups...");

  const addonGroup1Id = crypto.randomUUID();
  const addonGroup2Id = crypto.randomUUID();
  const addonGroup3Id = crypto.randomUUID();
  const addonGroup4Id = crypto.randomUUID();

  await db.insert(schema.addonGroups).values([
    {
      id: addonGroup1Id,
      menuId: menu1Id,
      name: "Pilihan Protein",
      isRequired: true,
      maxSelection: 1,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: addonGroup2Id,
      menuId: menu1Id,
      name: "Tingkat Kepedasan",
      isRequired: false,
      maxSelection: 1,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: addonGroup3Id,
      menuId: menu7Id,
      name: "Pilihan Susu",
      isRequired: false,
      maxSelection: 1,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: addonGroup4Id,
      menuId: menu7Id,
      name: "Ukuran",
      isRequired: true,
      maxSelection: 1,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== ADDONS (Tenant Level) ====================
  console.log("🧩 Seeding tenant addons...");

  await db.insert(schema.addons).values([
    // Pilihan Protein - Nasi Goreng
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup1Id,
      name: "Ayam",
      price: 0,
      isAvailable: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup1Id,
      name: "Udang",
      price: 8000,
      isAvailable: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup1Id,
      name: "Sapi",
      price: 10000,
      isAvailable: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    // Tingkat Kepedasan - Nasi Goreng
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup2Id,
      name: "Tidak Pedas",
      price: 0,
      isAvailable: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup2Id,
      name: "Pedas Sedang",
      price: 0,
      isAvailable: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup2Id,
      name: "Pedas Banget",
      price: 0,
      isAvailable: true,
      createdBy: managerId,
      updatedBy: managerId,
    },
    // Pilihan Susu - Americano
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup3Id,
      name: "Susu Sapi",
      price: 5000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup3Id,
      name: "Susu Oat",
      price: 8000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup3Id,
      name: "Susu Almond",
      price: 10000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    // Ukuran - Americano
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup4Id,
      name: "Small",
      price: 0,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup4Id,
      name: "Medium",
      price: 5000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
    {
      id: crypto.randomUUID(),
      addonGroupId: addonGroup4Id,
      name: "Large",
      price: 10000,
      isAvailable: true,
      createdBy: ownerId,
      updatedBy: ownerId,
    },
  ]);

  // ==================== TABLES ====================
  // Sekarang punya auditColumns (createdBy, updatedBy)
  console.log("🪑 Seeding tables...");

  const tableIds = [];
  const tablesToInsert = [];

  // Tenant 1 - 10 meja
  for (let i = 1; i <= 10; i++) {
    const tableId = crypto.randomUUID();
    tableIds.push({ id: tableId, tenantId: tenant1Id });
    tablesToInsert.push({
      id: tableId,
      number: i,
      tenantId: tenant1Id,
      createdBy: managerId,
      updatedBy: managerId,
    });
  }

  // Tenant 3 - 5 meja
  for (let i = 1; i <= 5; i++) {
    const tableId = crypto.randomUUID();
    tableIds.push({ id: tableId, tenantId: tenant3Id });
    tablesToInsert.push({
      id: tableId,
      number: i,
      tenantId: tenant3Id,
      createdBy: ownerId,
      updatedBy: ownerId,
    });
  }

  await db.insert(schema.tables).values(tablesToInsert);

  // ==================== SESSIONS ====================
  console.log("📅 Seeding sessions...");

  const today = new Date().toISOString().split("T")[0];

  const session1Id = crypto.randomUUID();
  const session2Id = crypto.randomUUID();

  const tenant1Tables = tableIds.filter((t) => t.tenantId === tenant1Id);
  const tenant3Tables = tableIds.filter((t) => t.tenantId === tenant3Id);

  await db.insert(schema.sessions).values([
    {
      id: session1Id,
      tenantId: tenant1Id,
      tableId: tenant1Tables[0].id,
      trxDate: today,
      isActive: true,
    },
    {
      id: session2Id,
      tenantId: tenant3Id,
      tableId: tenant3Tables[0].id,
      trxDate: today,
      isActive: true,
    },
  ]);

  // ==================== ORDERS ====================
  console.log("🛒 Seeding orders...");

  const order1Id = crypto.randomUUID();
  const order2Id = crypto.randomUUID();

  await db.insert(schema.orders).values([
    {
      id: order1Id,
      sessionId: session1Id,
      total_amount: 78000,
      paymentUrl: "https://payment.example.com/pay/order-001",
      paymentStatus: "PAID",
    },
    {
      id: order2Id,
      sessionId: session2Id,
      total_amount: 57000,
      paymentUrl: "https://payment.example.com/pay/order-002",
      paymentStatus: "PENDING",
    },
  ]);

  // ==================== ORDER ITEMS ====================
  console.log("📝 Seeding order items...");

  await db.insert(schema.orderItems).values([
    {
      id: crypto.randomUUID(),
      orderId: order1Id,
      menuId: menu1Id,
      quantity: 2,
      note: "Tidak pakai bawang",
    },
    {
      id: crypto.randomUUID(),
      orderId: order1Id,
      menuId: menu4Id,
      quantity: 2,
      note: null,
    },
    {
      id: crypto.randomUUID(),
      orderId: order2Id,
      menuId: menu7Id,
      quantity: 1,
      note: "Less ice",
    },
    {
      id: crypto.randomUUID(),
      orderId: order2Id,
      menuId: menu8Id,
      quantity: 1,
      note: null,
    },
  ]);

  console.log("✅ Seed completed successfully!");
  await connection.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
