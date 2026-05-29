CREATE TABLE `organization_menu_categories` (
	`id` varchar(36) NOT NULL,
	`category_name` varchar(255) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`order_number` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `organization_menu_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_order_unique` UNIQUE(`organization_id`,`order_number`)
);
--> statement-breakpoint
CREATE TABLE `organization_menus` (
	`id` varchar(36) NOT NULL,
	`organization_category_id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
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
	CONSTRAINT `organization_menus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `organization_menu_categories` ADD CONSTRAINT `organization_menu_categories_organization_id_tenants_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_menu_categories` ADD CONSTRAINT `organization_menu_categories_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_menu_categories` ADD CONSTRAINT `organization_menu_categories_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_menus` ADD CONSTRAINT `organization_menus_organization_category_id_menu_categories_id_fk` FOREIGN KEY (`organization_category_id`) REFERENCES `menu_categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_menus` ADD CONSTRAINT `organization_menus_organization_id_tenants_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_menus` ADD CONSTRAINT `organization_menus_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_menus` ADD CONSTRAINT `organization_menus_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;