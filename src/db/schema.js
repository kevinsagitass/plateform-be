import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  date,
  boolean,
  double,
  mysqlEnum,
  uniqueIndex,
  time,
} from "drizzle-orm/mysql-core";

export const auditColumns = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by", { length: 36 })
    .notNull()
    .references(() => users.id),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: varchar("updated_by", { length: 36 }).references(() => users.id),
};

export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  plan: mysqlEnum("plan", ["FREE", "BASIC", "PRO", "ENTERPRISE"]).notNull(),
  status: mysqlEnum("status", ["ACTIVE", "EXPIRED", "CANCELED"]).notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  ...auditColumns,
});

export const subscriptionConfig = mysqlTable("subscription_config", {
  plan: mysqlEnum("plan", ["FREE", "BASIC", "PRO", "ENTERPRISE"]).notNull(),
  maxOrganization: int("max_organization").notNull().default(0),
  maxTenant: int("max_tenant").notNull().default(0),
});

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: varchar("username", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  ...auditColumns,
});

export const organizations = mysqlTable("organizations", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  ...auditColumns,
});

export const tenants = mysqlTable("tenants", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  tenantName: varchar("tenant_name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  ...auditColumns,
});

export const organizationUsers = mysqlTable("organization_users", {
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  role: mysqlEnum("role", ["OWNER", "ADMIN", "STAFF"]).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tenantUsers = mysqlTable("tenant_users", {
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  tenantId: varchar("tenant_id", { length: 36 })
    .notNull()
    .references(() => tenants.id, {
      onDelete: "cascade",
    }),
  role: mysqlEnum("role", ["STORE_MANAGER", "CASHIER", "COOK"]).notNull(),
  ...auditColumns,
});

export const tenantWorkHours = mysqlTable("tenant_work_hours", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 36 })
    .notNull()
    .references(() => tenants.id, {
      onDelete: "cascade",
    }),
  dayOfMonth: int("day_of_month").notNull(),
  openHour: time("open_hour").notNull(),
  closeHour: time("close_hour").notNull(),
  isActive: boolean("is_active").default(true),
  ...auditColumns,
});

export const menuCategories = mysqlTable(
  "menu_categories",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    categoryName: varchar("category_name", { length: 255 }).notNull(),
    tenantId: varchar("tenant_id", { length: 36 })
      .notNull()
      .references(() => tenants.id, {
        onDelete: "cascade",
      }),
    orderNumber: int("order_number").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    ...auditColumns,
  },
  (table) => ({
    tenantOrderUnique: uniqueIndex("tenant_order_unique").on(
      table.tenantId,
      table.orderNumber
    ),
  })
);

export const menus = mysqlTable("menus", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  categoryId: varchar("category_id", { length: 36 })
    .notNull()
    .references(() => menuCategories.id, {
      onDelete: "cascade",
    }),
  tenantId: varchar("tenant_id", { length: 36 })
    .notNull()
    .references(() => tenants.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  imagePath: varchar("image_path", { length: 255 }).notNull(),
  price: double("price").notNull(),
  discount: double("discount").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  ...auditColumns,
});

export const addonGroups = mysqlTable("addon_groups", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  menuId: varchar("menu_id", { length: 36 })
    .notNull()
    .references(() => menus.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  isRequired: boolean("is_required").notNull().default(false),
  maxSelection: int("max_selection").notNull().default(1),
  ...auditColumns,
});

export const addons = mysqlTable("addons", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  addonGroupId: varchar("addon_group_id", { length: 36 })
    .notNull()
    .references(() => addonGroups.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  price: double("price").notNull().default(0),
  isAvailable: boolean("is_available").notNull().default(true),
  ...auditColumns,
});

export const tables = mysqlTable("tables", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  number: int("number").notNull(),
  tenantId: varchar("tenant_id", { length: 36 })
    .notNull()
    .references(() => tenants.id, {
      onDelete: "cascade",
    }),
  ...auditColumns,
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 36 })
    .notNull()
    .references(() => tenants.id, {
      onDelete: "cascade",
    }),
  tableId: varchar("table_id", { length: 36 })
    .notNull()
    .references(() => tables.id, {
      onDelete: "cascade",
    }),
  trxDate: date("trx_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  finishedAt: timestamp("finished_at"),
});

export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionId: varchar("session_id", { length: 36 })
    .notNull()
    .references(() => sessions.id, {
      onDelete: "cascade",
    }),
  total_amount: int("total_amount").notNull(),
  paymentUrl: varchar("payment_url", { length: 255 }).notNull(),
  paymentStatus: mysqlEnum("payment_status", [
    "PENDING",
    "PAID",
    "EXPIRED",
    "CANCELLED",
  ])
    .notNull()
    .default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = mysqlTable("order_items", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  menuId: varchar("menu_id", { length: 36 })
    .notNull()
    .references(() => menus.id),
  quantity: int("quantity").notNull().default(1),
  note: varchar("note", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});
