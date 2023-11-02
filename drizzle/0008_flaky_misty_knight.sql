ALTER TABLE `placeCategory` ADD `namePlural` tinytext NOT NULL;--> statement-breakpoint
ALTER TABLE `placeCategory` ADD `nameGender` enum('masculine','feminine');--> statement-breakpoint
ALTER TABLE `placeCategory_translation` ADD `namePlural` tinytext NOT NULL;--> statement-breakpoint
ALTER TABLE `placeCategory_translation` ADD `nameGender` enum('masculine','feminine');