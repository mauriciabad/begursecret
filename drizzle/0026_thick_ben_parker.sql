CREATE TABLE `placeCategoryToPlaceCategoryGroup` (
	`categoryGroupId` int NOT NULL,
	`categoryId` int NOT NULL,
	CONSTRAINT `placeCategoryToPlaceCategoryGroup_categoryGroupId_categoryId_pk` PRIMARY KEY(`categoryGroupId`,`categoryId`)
);
--> statement-breakpoint
CREATE TABLE `placeCategoryGroup` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`icon` tinytext NOT NULL,
	`color` tinytext NOT NULL,
	`order` int,
	`name` tinytext NOT NULL,
	`nameGender` enum('masculine','feminine'),
	CONSTRAINT `placeCategoryGroup_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `placeCategoryGroup_translation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`placeCategoryGroup_id` int NOT NULL,
	`locale` varchar(10) NOT NULL,
	`name` tinytext NOT NULL,
	`nameGender` enum('masculine','feminine'),
	CONSTRAINT `placeCategoryGroup_translation_id` PRIMARY KEY(`id`)
);
