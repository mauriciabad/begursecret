CREATE TABLE `place_translation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`place_id` int NOT NULL,
	`locale` varchar(10) NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT `place_translation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
RENAME TABLE `place` TO `place_data`;--> statement-breakpoint
ALTER TABLE `place_data` DROP COLUMN `name`;