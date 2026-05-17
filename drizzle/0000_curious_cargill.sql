CREATE TABLE `addon_groups` (
	`id` varchar(36) NOT NULL,
	`menu_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_required` boolean NOT NULL DEFAULT false,
	`max_selection` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `addon_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `addons` (
	`id` varchar(36) NOT NULL,
	`addon_group_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` double NOT NULL DEFAULT 0,
	`is_available` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `addons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_categories` (
	`id` varchar(36) NOT NULL,
	`category_name` varchar(255) NOT NULL,
	`tenant_id` varchar(36) NOT NULL,
	`order_number` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `menu_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `tenant_order_unique` UNIQUE(`tenant_id`,`order_number`)
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` varchar(36) NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`tenant_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`image_path` varchar(255) NOT NULL,
	`price` double NOT NULL,
	`discount` double NOT NULL,
	`is_available` boolean NOT NULL DEFAULT true,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `menus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`menu_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`note` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`session_id` varchar(36) NOT NULL,
	`total_amount` int NOT NULL,
	`payment_url` varchar(255) NOT NULL,
	`payment_status` enum('PENDING','PAID','EXPIRED','CANCELLED') NOT NULL DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organization_users` (
	`user_id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`role` enum('OWNER','ADMIN') NOT NULL,
	`created_at` timestamp DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`subscription_status` enum('ACTIVE','TRIAL','EXPIRED') DEFAULT 'TRIAL',
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(36) NOT NULL,
	`tenant_id` varchar(36) NOT NULL,
	`table_id` varchar(36) NOT NULL,
	`trx_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`plan` enum('FREE','BASIC','PRO') NOT NULL,
	`status` enum('ACTIVE','EXPIRED','CANCELED') NOT NULL,
	`start_date` timestamp DEFAULT (now()),
	`end_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tables` (
	`id` varchar(36) NOT NULL,
	`number` int NOT NULL,
	`tenant_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `tables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenant_users` (
	`user_id` varchar(36) NOT NULL,
	`tenant_id` varchar(36) NOT NULL,
	`role` enum('STORE_MANAGER','CASHIER','COOK') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36)
);
--> statement-breakpoint
CREATE TABLE `tenant_work_hours` (
	`id` varchar(36) NOT NULL,
	`tenant_id` varchar(36) NOT NULL,
	`day_of_month` int NOT NULL,
	`open_hour` time NOT NULL,
	`close_hour` time NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `tenant_work_hours_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`tenant_name` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`username` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `addon_groups` ADD CONSTRAINT `addon_groups_menu_id_menus_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `addons` ADD CONSTRAINT `addons_addon_group_id_addon_groups_id_fk` FOREIGN KEY (`addon_group_id`) REFERENCES `addon_groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_categories` ADD CONSTRAINT `menu_categories_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menus` ADD CONSTRAINT `menus_category_id_menu_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `menu_categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menus` ADD CONSTRAINT `menus_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_menu_id_menus_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_users` ADD CONSTRAINT `organization_users_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_users` ADD CONSTRAINT `organization_users_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_table_id_tables_id_fk` FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tables` ADD CONSTRAINT `tables_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenant_users` ADD CONSTRAINT `tenant_users_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenant_users` ADD CONSTRAINT `tenant_users_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenant_work_hours` ADD CONSTRAINT `tenant_work_hours_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenants` ADD CONSTRAINT `tenants_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;