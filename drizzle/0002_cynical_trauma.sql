CREATE TABLE `organization_addon_groups` (
	`id` varchar(36) NOT NULL,
	`organization_menu_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_required` boolean NOT NULL DEFAULT false,
	`max_selection` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `organization_addon_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organization_addons` (
	`id` varchar(36) NOT NULL,
	`organization_addon_group_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` double NOT NULL DEFAULT 0,
	`is_available` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(36) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	CONSTRAINT `organization_addons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `organization_menu_categories` DROP FOREIGN KEY `organization_menu_categories_organization_id_tenants_id_fk`;
--> statement-breakpoint
ALTER TABLE `organization_menus` DROP FOREIGN KEY `organization_menus_organization_category_id_menu_categories_id_fk`;
--> statement-breakpoint
ALTER TABLE `organization_menus` DROP FOREIGN KEY `organization_menus_organization_id_tenants_id_fk`;
--> statement-breakpoint
ALTER TABLE `organization_addon_groups` ADD CONSTRAINT `organization_addon_groups_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_addon_groups` ADD CONSTRAINT `organization_addon_groups_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_addons` ADD CONSTRAINT `organization_addons_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_addons` ADD CONSTRAINT `organization_addons_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_menu_categories` ADD CONSTRAINT `organization_menu_categories_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_menus` ADD CONSTRAINT `organization_menus_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;