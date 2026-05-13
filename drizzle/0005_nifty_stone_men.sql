CREATE TABLE `tenants` (
	`id` varchar(36) NOT NULL,
	`tenant_name` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_tenants` (
	`user_id` varchar(36) NOT NULL,
	`tenant_id` varchar(36) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `menu_categories` ADD `tenant_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `menus` ADD `tenant_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `tenant_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `tables` ADD `tenant_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_tenants` ADD CONSTRAINT `user_tenants_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_tenants` ADD CONSTRAINT `user_tenants_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_categories` ADD CONSTRAINT `menu_categories_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menus` ADD CONSTRAINT `menus_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tables` ADD CONSTRAINT `tables_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;