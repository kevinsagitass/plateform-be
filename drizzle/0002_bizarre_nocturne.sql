CREATE TABLE `menu_categories` (
	`id` varchar(36) NOT NULL,
	`category_name` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `menu_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `menus` ADD `category_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `menus` ADD CONSTRAINT `menus_category_id_menu_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `menu_categories`(`id`) ON DELETE cascade ON UPDATE no action;