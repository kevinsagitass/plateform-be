ALTER TABLE `menus` ADD `is_available` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `menu_categories` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `menus` DROP COLUMN `updated_at`;