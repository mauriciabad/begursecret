CREATE TABLE `placeListToPlace` (
	`placeListId` int NOT NULL,
	`placeId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `placeListToPlace_placeId_placeListId` PRIMARY KEY(`placeId`,`placeListId`)
);
--> statement-breakpoint
CREATE TABLE `placeList` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `placeList_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user` ADD `visitedPlaceListId` int NOT NULL;