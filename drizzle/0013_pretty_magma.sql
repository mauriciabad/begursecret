CREATE TABLE `image` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`key` varchar(1024) NOT NULL,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`alt` tinytext,
	CONSTRAINT `image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `place` ADD `mainImageId` int;--> statement-breakpoint
ALTER TABLE `place` DROP COLUMN `mainImage`;