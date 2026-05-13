import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  date,
  boolean,
  double,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const paymentStatusEnum = ["pending", "paid"];

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: varchar("username", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const tenants = mysqlTable("tenants", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tenantName: varchar("tenant_name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userTenants = mysqlTable("user_tenants", {
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
});

export const menuCategories = mysqlTable("menu_categories", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  tenantId: varchar("tenant_id", { length: 36 })
    .notNull()
    .references(() => tenants.id, {
      onDelete: "cascade",
    }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
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
  finishedAt: timestamp("updated_at"),
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
  paymentStatus: mysqlEnum("payment_status", paymentStatusEnum)
    .notNull()
    .default("pending"),
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
