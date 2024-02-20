CREATE TABLE `routeCategory` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`icon` tinytext NOT NULL,
	`color` tinytext NOT NULL,
	`hasVisitMission` boolean NOT NULL DEFAULT true,
	`name` tinytext NOT NULL,
	`namePlural` tinytext NOT NULL,
	`nameGender` enum('masculine','feminine'),
	CONSTRAINT `routeCategory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `routeCategory_translation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`routeCategory_id` int NOT NULL,
	`locale` varchar(10) NOT NULL,
	`name` tinytext NOT NULL,
	`namePlural` tinytext NOT NULL,
	`nameGender` enum('masculine','feminine'),
	CONSTRAINT `routeCategory_translation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `route` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`mainImageId` int,
	`path` MULTILINESTRING SRID 25831 NOT NULL,
	`mainCategoryId` int NOT NULL,
	`featuresId` int NOT NULL,
	`verificationRequirementsId` int,
	`name` text NOT NULL,
	`description` tinytext,
	`content` text,
	CONSTRAINT `route_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `routeToPlace` (
	`routeId` int NOT NULL,
	`placeId` int NOT NULL,
	CONSTRAINT `routeToPlace_placeId_routeId_pk` PRIMARY KEY(`placeId`,`routeId`)
);
--> statement-breakpoint
CREATE TABLE `routeToRouteCategory` (
	`routeId` int NOT NULL,
	`categoryId` int NOT NULL,
	CONSTRAINT `routeToRouteCategory_categoryId_routeId_pk` PRIMARY KEY(`categoryId`,`routeId`)
);
--> statement-breakpoint
CREATE TABLE `route_translation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`route_id` int NOT NULL,
	`locale` varchar(10) NOT NULL,
	`name` text NOT NULL,
	`description` tinytext,
	`content` text,
	CONSTRAINT `route_translation_id` PRIMARY KEY(`id`)
);
