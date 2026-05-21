import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";
import bcrypt from "bcryptjs";

// ─── Connection ───────────────────────────────────────────────────────────────

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "plateform",
});

const db = drizzle(connection, { schema, mode: "default" });

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uuid = () => crypto.randomUUID();
const now = new Date();
const hashedPassword = await bcrypt.hash("password123", 10);

const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

// ─── IDs ──────────────────────────────────────────────────────────────────────

// Users
const superAdminId = uuid();
const owner1Id     = uuid();
const owner2Id     = uuid();
const admin1Id     = uuid();
const staff1Id     = uuid();
const manager1Id   = uuid();
const manager2Id   = uuid();
const cashier1Id   = uuid();
const cashier2Id   = uuid();
const cook1Id      = uuid();
const cook2Id      = uuid();

// Organizations
const org1Id = uuid();
const org2Id = uuid();

// Tenants
const tenant1Id = uuid();
const tenant2Id = uuid();
const tenant3Id = uuid();

// Menu Categories
const cat1Id = uuid(); // Burgers     - tenant1
const cat2Id = uuid(); // Sides       - tenant1
const cat3Id = uuid(); // Drinks      - tenant1
const cat4Id = uuid(); // Noodles     - tenant3
const cat5Id = uuid(); // Appetizers  - tenant3

// Menus
const menu1Id  = uuid(); // Classic Burger
const menu2Id  = uuid(); // Cheese Burger
const menu3Id  = uuid(); // BBQ Burger
const menu4Id  = uuid(); // French Fries
const menu5Id  = uuid(); // Onion Rings
const menu6Id  = uuid(); // Cola
const menu7Id  = uuid(); // Lemonade
const menu8Id  = uuid(); // Tonkotsu Ramen
const menu9Id  = uuid(); // Pad Thai
const menu10Id = uuid(); // Spring Rolls

// Addon Groups
const ag1Id = uuid(); // Patty Size   - Classic Burger
const ag2Id = uuid(); // Extras       - Classic Burger
const ag3Id = uuid(); // Size         - French Fries
const ag4Id = uuid(); // Toppings     - Ramen
const ag5Id = uuid(); // Spice Level  - Pad Thai

// Tables
const t1_table1Id = uuid();
const t1_table2Id = uuid();
const t1_table3Id = uuid();
const t1_table4Id = uuid();
const t1_table5Id = uuid();
const t3_table1Id = uuid();
const t3_table2Id = uuid();
const t3_table3Id = uuid();

// Sessions
const session1Id = uuid();
const session2Id = uuid();
const session3Id = uuid();

// Orders
const order1Id = uuid();
const order2Id = uuid();
const order3Id = uuid();

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ── 1. Users ────────────────────────────────────────────────────────────────
  console.log("👤 Seeding users...");

  await db.insert(schema.users).values([
    {
      id: superAdminId,
      username: "superadmin",
      name: "Super Admin",
      email: "superadmin@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: owner1Id,
      username: "owner_john",
      name: "John Owner",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: owner2Id,
      username: "owner_jane",
      name: "Jane Owner",
      email: "jane@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: admin1Id,
      username: "admin_bob",
      name: "Bob Admin",
      email: "bob@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: staff1Id,
      username: "staff_alice",
      name: "Alice Staff",
      email: "alice@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: manager1Id,
      username: "manager_sara",
      name: "Sara Manager",
      email: "sara@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: manager2Id,
      username: "manager_tom",
      name: "Tom Manager",
      email: "tom@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: cashier1Id,
      username: "cashier_mike",
      name: "Mike Cashier",
      email: "mike@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: cashier2Id,
      username: "cashier_emma",
      name: "Emma Cashier",
      email: "emma@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: cook1Id,
      username: "cook_lisa",
      name: "Lisa Cook",
      email: "lisa@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
    {
      id: cook2Id,
      username: "cook_david",
      name: "David Cook",
      email: "david@example.com",
      password: hashedPassword,
      createdAt: now,
      createdBy: superAdminId,
      updatedAt: now,
      updatedBy: superAdminId,
    },
  ]);

  console.log("   ✔ 11 users inserted");

  // ── 2. Subscription Config ──────────────────────────────────────────────────
  console.log("⚙️  Seeding subscription config...");

  await db.insert(schema.subscriptionConfig).values([
    { plan: "FREE",       maxOrganization: 1,   maxTenant: 1   },
    { plan: "BASIC",      maxOrganization: 3,   maxTenant: 5   },
    { plan: "PRO",        maxOrganization: 10,  maxTenant: 20  },
    { plan: "ENTERPRISE", maxOrganization: 999, maxTenant: 999 },
  ]);

  console.log("   ✔ 4 subscription configs inserted");

  // ── 3. Organizations ────────────────────────────────────────────────────────
  console.log("🏢 Seeding organizations...");

  await db.insert(schema.organizations).values([
    {
      id: org1Id,
      name: "Burger House Group",
      isActive: true,
      createdAt: now,
      createdBy: owner1Id,
      updatedAt: now,
      updatedBy: owner1Id,
    },
    {
      id: org2Id,
      name: "Noodle Empire Co.",
      isActive: true,
      createdAt: now,
      createdBy: owner2Id,
      updatedAt: now,
      updatedBy: owner2Id,
    },
  ]);

  console.log("   ✔ 2 organizations inserted");

  // ── 4. Subscriptions ────────────────────────────────────────────────────────
  console.log("💳 Seeding subscriptions...");

  await db.insert(schema.subscriptions).values([
    {
      id: uuid(),
      userId: owner1Id,
      plan: "PRO",
      status: "ACTIVE",
      startDate: daysAgo(30),
      endDate: daysFromNow(335),
      createdAt: now,
      createdBy: owner1Id,
      updatedAt: now,
      updatedBy: owner1Id,
    },
    {
      id: uuid(),
      userId: owner2Id,
      plan: "BASIC",
      status: "ACTIVE",
      startDate: daysAgo(10),
      endDate: daysFromNow(20),
      createdAt: now,
      createdBy: owner2Id,
      updatedAt: now,
      updatedBy: owner2Id,
    },
    {
      id: uuid(),
      userId: admin1Id,
      plan: "FREE",
      status: "ACTIVE",
      startDate: daysAgo(5),
      endDate: daysFromNow(25),
      createdAt: now,
      createdBy: admin1Id,
      updatedAt: now,
      updatedBy: admin1Id,
    },
  ]);

  console.log("   ✔ 3 subscriptions inserted");

  // ── 5. Organization Users ───────────────────────────────────────────────────
  console.log("🔗 Seeding organization users...");

  await db.insert(schema.organizationUsers).values([
    // Org 1 — Burger House
    { userId: owner1Id, organizationId: org1Id, role: "OWNER", createdAt: now },
    { userId: admin1Id, organizationId: org1Id, role: "ADMIN", createdAt: now },
    { userId: staff1Id, organizationId: org1Id, role: "STAFF", createdAt: now },
    // Org 2 — Noodle Empire
    { userId: owner2Id, organizationId: org2Id, role: "OWNER", createdAt: now },
    { userId: admin1Id, organizationId: org2Id, role: "ADMIN", createdAt: now },
  ]);

  console.log("   ✔ 5 organization users inserted");

  // ── 6. Tenants ──────────────────────────────────────────────────────────────
  console.log("🏪 Seeding tenants...");

  await db.insert(schema.tenants).values([
    {
      id: tenant1Id,
      organizationId: org1Id,
      tenantName: "Burger House - Downtown",
      location: "123 Main St, Downtown",
      isActive: true,
      createdAt: now,
      createdBy: owner1Id,
      updatedAt: now,
      updatedBy: owner1Id,
    },
    {
      id: tenant2Id,
      organizationId: org1Id,
      tenantName: "Burger House - Uptown",
      location: "456 Oak Ave, Uptown",
      isActive: true,
      createdAt: now,
      createdBy: owner1Id,
      updatedAt: now,
      updatedBy: owner1Id,
    },
    {
      id: tenant3Id,
      organizationId: org2Id,
      tenantName: "Noodle Empire - Central",
      location: "789 Elm Rd, Central",
      isActive: true,
      createdAt: now,
      createdBy: owner2Id,
      updatedAt: now,
      updatedBy: owner2Id,
    },
  ]);

  console.log("   ✔ 3 tenants inserted");

  // ── 7. Tenant Users ─────────────────────────────────────────────────────────
  console.log("👥 Seeding tenant users...");

  await db.insert(schema.tenantUsers).values([
    // Tenant 1 — Burger House Downtown
    {
      userId: manager1Id,
      tenantId: tenant1Id,
      role: "STORE_MANAGER",
      createdAt: now,
      createdBy: owner1Id,
      updatedAt: now,
      updatedBy: owner1Id,
    },
    {
      userId: cashier1Id,
      tenantId: tenant1Id,
      role: "CASHIER",
      createdAt: now,
      createdBy: owner1Id,
      updatedAt: now,
      updatedBy: owner1Id,
    },
    {
      userId: cook1Id,
      tenantId: tenant1Id,
      role: "COOK",
      createdAt: now,
      createdBy: owner1Id,
      updatedAt: now,
      updatedBy: owner1Id,
    },
    // Tenant 2 — Burger House Uptown
    {
      userId: manager2Id,
      tenantId: tenant2Id,
      role: "STORE_MANAGER",
      createdAt: now,
      createdBy: owner1Id,
      updatedAt: now,
      updatedBy: owner1Id,
    },
    {
      userId: cashier2Id,
      tenantId: tenant2Id,
      role: "CASHIER",
      createdAt: now,
      createdBy: owner1Id,
      updatedAt: now,
      updatedBy: owner1Id,
    },
    // Tenant 3 — Noodle Empire Central
    {
      userId: manager1Id,
      tenantId: tenant3Id,
      role: "STORE_MANAGER",
      createdAt: now,
      createdBy: owner2Id,
      updatedAt: now,
      updatedBy: owner2Id,
    },
    {
      userId: cashier1Id,
      tenantId: tenant3Id,
      role: "CASHIER",
      createdAt: now,
      createdBy: owner2Id,
      updatedAt: now,
      updatedBy: owner2Id,
    },
    {
      userId: cook2Id,
      tenantId: tenant3Id,
      role: "COOK",
      createdAt: now,
      createdBy: owner2Id,
      updatedAt: now,
      updatedBy: owner2Id,
    },
  ]);

  console.log("   ✔ 8 tenant users inserted");

  // ── 8. Tenant Work Hours ────────────────────────────────────────────────────
  console.log("🕐 Seeding tenant work hours...");

  const workHours = [];
  const allTenantIds = [
    { id: tenant1Id, createdBy: owner1Id },
    { id: tenant2Id, createdBy: owner1Id },
    { id: tenant3Id, createdBy: owner2Id },
  ];

  for (const { id: tenantId, createdBy } of allTenantIds) {
    for (let day = 1; day <= 7; day++) {
      const isWeekend = day === 6 || day === 7;
      workHours.push({
        id: uuid(),
        tenantId,
        dayOfMonth: day,
        openHour:  isWeekend ? "09:00:00" : "08:00:00",
        closeHour: isWeekend ? "23:00:00" : "22:00:00",
        isActive: true,
        createdAt: now,
        createdBy,
        updatedAt: now,
        updatedBy: createdBy,
      });
    }
  }

  await db.insert(schema.tenantWorkHours).values(workHours);
  console.log(`   ✔ ${workHours.length} work hour records inserted`);

  // ── 9. Menu Categories ──────────────────────────────────────────────────────
  console.log("📂 Seeding menu categories...");

  await db.insert(schema.menuCategories).values([
    {
      id: cat1Id,
      categoryName: "Burgers",
      tenantId: tenant1Id,
      orderNumber: 1,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: cat2Id,
      categoryName: "Sides",
      tenantId: tenant1Id,
      orderNumber: 2,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: cat3Id,
      categoryName: "Drinks",
      tenantId: tenant1Id,
      orderNumber: 3,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: cat4Id,
      categoryName: "Noodles",
      tenantId: tenant3Id,
      orderNumber: 1,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: cat5Id,
      categoryName: "Appetizers",
      tenantId: tenant3Id,
      orderNumber: 2,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
  ]);

  console.log("   ✔ 5 menu categories inserted");

  // ── 10. Menus ───────────────────────────────────────────────────────────────
  console.log("🍔 Seeding menus...");

  await db.insert(schema.menus).values([
    // ── Burgers ──
    {
      id: menu1Id,
      categoryId: cat1Id,
      tenantId: tenant1Id,
      name: "Classic Burger",
      description: "Juicy beef patty with lettuce, tomato, and pickles",
      imagePath: "/images/menus/classic-burger.jpg",
      price: 8.99,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: menu2Id,
      categoryId: cat1Id,
      tenantId: tenant1Id,
      name: "Cheese Burger",
      description: "Classic burger topped with melted cheddar cheese",
      imagePath: "/images/menus/cheese-burger.jpg",
      price: 10.99,
      discount: 0.5,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: menu3Id,
      categoryId: cat1Id,
      tenantId: tenant1Id,
      name: "BBQ Burger",
      description: "Smoky BBQ sauce with crispy bacon and onion rings",
      imagePath: "/images/menus/bbq-burger.jpg",
      price: 12.99,
      discount: 1.0,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    // ── Sides ──
    {
      id: menu4Id,
      categoryId: cat2Id,
      tenantId: tenant1Id,
      name: "French Fries",
      description: "Golden crispy fries lightly salted",
      imagePath: "/images/menus/french-fries.jpg",
      price: 3.99,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: menu5Id,
      categoryId: cat2Id,
      tenantId: tenant1Id,
      name: "Onion Rings",
      description: "Crispy battered onion rings with dipping sauce",
      imagePath: "/images/menus/onion-rings.jpg",
      price: 4.49,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    // ── Drinks ──
    {
      id: menu6Id,
      categoryId: cat3Id,
      tenantId: tenant1Id,
      name: "Cola",
      description: "Chilled classic cola drink",
      imagePath: "/images/menus/cola.jpg",
      price: 2.49,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: menu7Id,
      categoryId: cat3Id,
      tenantId: tenant1Id,
      name: "Lemonade",
      description: "Freshly squeezed lemonade with mint",
      imagePath: "/images/menus/lemonade.jpg",
      price: 3.49,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    // ── Noodles ──
    {
      id: menu8Id,
      categoryId: cat4Id,
      tenantId: tenant3Id,
      name: "Tonkotsu Ramen",
      description: "Rich pork bone broth with chashu and soft-boiled egg",
      imagePath: "/images/menus/ramen.jpg",
      price: 13.99,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: menu9Id,
      categoryId: cat4Id,
      tenantId: tenant3Id,
      name: "Pad Thai",
      description: "Stir-fried rice noodles with shrimp, peanuts, and lime",
      imagePath: "/images/menus/pad-thai.jpg",
      price: 11.99,
      discount: 1.0,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    // ── Appetizers ──
    {
      id: menu10Id,
      categoryId: cat5Id,
      tenantId: tenant3Id,
      name: "Spring Rolls",
      description: "Crispy vegetable spring rolls with sweet chili sauce",
      imagePath: "/images/menus/spring-rolls.jpg",
      price: 6.99,
      discount: 0,
      isAvailable: true,
      isActive: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
  ]);

  console.log("   ✔ 10 menus inserted");

  // ── 11. Addon Groups ────────────────────────────────────────────────────────
  console.log("➕ Seeding addon groups...");

  await db.insert(schema.addonGroups).values([
    {
      id: ag1Id,
      menuId: menu1Id,
      name: "Patty Size",
      isRequired: true,
      maxSelection: 1,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: ag2Id,
      menuId: menu1Id,
      name: "Extras",
      isRequired: false,
      maxSelection: 3,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: ag3Id,
      menuId: menu4Id,
      name: "Size",
      isRequired: true,
      maxSelection: 1,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: ag4Id,
      menuId: menu8Id,
      name: "Toppings",
      isRequired: false,
      maxSelection: 4,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: ag5Id,
      menuId: menu9Id,
      name: "Spice Level",
      isRequired: true,
      maxSelection: 1,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
  ]);

  console.log("   ✔ 5 addon groups inserted");

  // ── 12. Addons ──────────────────────────────────────────────────────────────
  console.log("🧩 Seeding addons...");

  await db.insert(schema.addons).values([
    // ── Patty Size ──
    {
      id: uuid(),
      addonGroupId: ag1Id,
      name: "Regular",
      price: 0,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag1Id,
      name: "Double",
      price: 2.5,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    // ── Extras ──
    {
      id: uuid(),
      addonGroupId: ag2Id,
      name: "Extra Cheese",
      price: 0.99,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag2Id,
      name: "Bacon",
      price: 1.49,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag2Id,
      name: "Avocado",
      price: 1.99,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    // ── Fries Size ──
    {
      id: uuid(),
      addonGroupId: ag3Id,
      name: "Small",
      price: 0,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag3Id,
      name: "Medium",
      price: 0.75,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag3Id,
      name: "Large",
      price: 1.25,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    // ── Ramen Toppings ──
    {
      id: uuid(),
      addonGroupId: ag4Id,
      name: "Extra Chashu",
      price: 2.0,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag4Id,
      name: "Soft Boiled Egg",
      price: 1.0,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag4Id,
      name: "Bamboo Shoots",
      price: 0.75,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag4Id,
      name: "Nori",
      price: 0.5,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    // ── Spice Level ──
    {
      id: uuid(),
      addonGroupId: ag5Id,
      name: "Mild",
      price: 0,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag5Id,
      name: "Medium",
      price: 0,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
    {
      id: uuid(),
      addonGroupId: ag5Id,
      name: "Hot",
      price: 0,
      isAvailable: true,
      createdAt: now,
      createdBy: manager1Id,
      updatedAt: now,
      updatedBy: manager1Id,
    },
  ]);

  console.log("   ✔ 15 addons inserted");

  // ── 13. Tables ──────────────────────────────────────────────────────────────
  console.log("🪑 Seeding tables...");

  await db.insert(schema.tables).values([
    // Tenant 1 — 5 tables
    { id: t1_table1Id, number: 1, tenantId: tenant1Id, createdAt: now, createdBy: manager1Id, updatedAt: now, updatedBy: manager1Id },
    { id: t1_table2Id, number: 2, tenantId: tenant1Id, createdAt: now, createdBy: manager1Id, updatedAt: now, updatedBy: manager1Id },
    { id: t1_table3Id, number: 3, tenantId: tenant1Id, createdAt: now, createdBy: manager1Id, updatedAt: now, updatedBy: manager1Id },
    { id: t1_table4Id, number: 4, tenantId: tenant1Id, createdAt: now, createdBy: manager1Id, updatedAt: now, updatedBy: manager1Id },
    { id: t1_table5Id, number: 5, tenantId: tenant1Id, createdAt: now, createdBy: manager1Id, updatedAt: now, updatedBy: manager1Id },
    // Tenant 3 — 3 tables
    { id: t3_table1Id, number: 1, tenantId: tenant3Id, createdAt: now, createdBy: manager1Id, updatedAt: now, updatedBy: manager1Id },
    { id: t3_table2Id, number: 2, tenantId: tenant3Id, createdAt: now, createdBy: manager1Id, updatedAt: now, updatedBy: manager1Id },
    { id: t3_table3Id, number: 3, tenantId: tenant3Id, createdAt: now, createdBy: manager1Id, updatedAt: now, updatedBy: manager1Id },
  ]);

  console.log("   ✔ 8 tables inserted");

  // ── 14. Sessions ────────────────────────────────────────────────────────────
  console.log("📋 Seeding sessions...");

  const todayStr     = now.toISOString().split("T")[0];
  const yesterdayStr = daysAgo(1).toISOString().split("T")[0];

  await db.insert(schema.sessions).values([
    {
      id: session1Id,
      tenantId: tenant1Id,
      tableId: t1_table1Id,
      trxDate: todayStr,
      isActive: true,
      createdAt: now,
      finishedAt: null,
    },
    {
      id: session2Id,
      tenantId: tenant1Id,
      tableId: t1_table2Id,
      trxDate: yesterdayStr,
      isActive: false,
      createdAt: daysAgo(1),
      finishedAt: daysAgo(1),
    },
    {
      id: session3Id,
      tenantId: tenant3Id,
      tableId: t3_table1Id,
      trxDate: todayStr,
      isActive: true,
      createdAt: now,
      finishedAt: null,
    },
  ]);

  console.log("   ✔ 3 sessions inserted");

  // ── 15. Orders ──────────────────────────────────────────────────────────────
  console.log("🧾 Seeding orders...");

  await db.insert(schema.orders).values([
    {
      id: order1Id,
      sessionId: session1Id,
      total_amount: 2498,
      paymentUrl: "https://payment.example.com/pay/order1",
      paymentStatus: "PAID",
      createdAt: now,
    },
    {
      id: order2Id,
      sessionId: session2Id,
      total_amount: 1347,
      paymentUrl: "https://payment.example.com/pay/order2",
      paymentStatus: "PAID",
      createdAt: daysAgo(1),
    },
    {
      id: order3Id,
      sessionId: session3Id,
      total_amount: 3197,
      paymentUrl: "https://payment.example.com/pay/order3",
      paymentStatus: "PENDING",
      createdAt: now,
    },
  ]);

  console.log("   ✔ 3 orders inserted");

  // ── 16. Order Items ─────────────────────────────────────────────────────────
  console.log("🍟 Seeding order items...");

  await db.insert(schema.orderItems).values([
    // Order 1 — Classic Burger + Fries + Cola
    { id: uuid(), orderId: order1Id, menuId: menu1Id, quantity: 2, note: "No pickles",   createdAt: now       },
    { id: uuid(), orderId: order1Id, menuId: menu4Id, quantity: 2, note: null,            createdAt: now       },
    { id: uuid(), orderId: order1Id, menuId: menu6Id, quantity: 2, note: null,            createdAt: now       },
    // Order 2 — Cheese Burger + Lemonade
    { id: uuid(), orderId: order2Id, menuId: menu2Id, quantity: 1, note: "Extra sauce",  createdAt: daysAgo(1) },
    { id: uuid(), orderId: order2Id, menuId: menu7Id, quantity: 1, note: null,            createdAt: daysAgo(1) },
    // Order 3 — Ramen + Spring Rolls + Pad Thai
    { id: uuid(), orderId: order3Id, menuId: menu8Id,  quantity: 2, note: "Extra spicy", createdAt: now       },
    { id: uuid(), orderId: order3Id, menuId: menu10Id, quantity: 1, note: null,           createdAt: now       },
    { id: uuid(), orderId: order3Id, menuId: menu9Id,  quantity: 1, note: "No peanuts",  createdAt: now       },
  ]);

  console.log("   ✔ 8 order items inserted");

  // ── Done ────────────────────────────────────────────────────────────────────
  console.log(`
✅ Seeding complete!

📊 Summary
──────────────────────────────────
   Users                : 11
   Subscription Config  : 4
   Organizations        : 2
   Subscriptions        : 3
   Organization Users   : 5
   Tenants              : 3
   Tenant Users         : 8
   Work Hours           : ${workHours.length}
   Menu Categories      : 5
   Menus                : 10
   Addon Groups         : 5
   Addons               : 15
   Tables               : 8
   Sessions             : 3
   Orders               : 3
   Order Items          : 8
──────────────────────────────────

🔑 All passwords : password123

📧 Test accounts
──────────────────────────────────
   superadmin@example.com  — Super Admin
   john@example.com        — Org Owner   (Burger House)
   jane@example.com        — Org Owner   (Noodle Empire)
   bob@example.com         — Org Admin
   alice@example.com       — Org Staff
   sara@example.com        — Store Manager
   tom@example.com         — Store Manager
   mike@example.com        — Cashier
   emma@example.com        — Cashier
   lisa@example.com        — Cook
   david@example.com       — Cook
──────────────────────────────────
  `);
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => connection.end());