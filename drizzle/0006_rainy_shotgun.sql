CREATE TABLE `placeCategory` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`icon` tinytext NOT NULL,
	`color` tinytext NOT NULL,
	`name` tinytext NOT NULL,
	`namePlural` tinytext NOT NULL,
	`nameGender` enum('masculine','feminine'),
	CONSTRAINT `placeCategory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `placeCategory_translation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`placeCategory_id` int NOT NULL,
	`locale` varchar(10) NOT NULL,
	`name` tinytext NOT NULL,
	`namePlural` tinytext NOT NULL,
	`nameGender` enum('masculine','feminine'),
	CONSTRAINT `placeCategory_translation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `placeToPlaceCategory` (
	`placeId` int NOT NULL,
	`categoryId` int NOT NULL,
	CONSTRAINT `placeToPlaceCategory_categoryId_placeId` PRIMARY KEY(`categoryId`,`placeId`)
);
--> statement-breakpoint
ALTER TABLE `place` MODIFY COLUMN `location` point NOT NULL;--> statement-breakpoint
ALTER TABLE `place` ADD `mainCategoryId` int DEFAULT 1 NOT NULL;