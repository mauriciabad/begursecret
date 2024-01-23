ALTER TABLE `placeListToPlace` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `placeToPlaceCategory` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `placeListToPlace` ADD PRIMARY KEY(`placeId`,`placeListId`);--> statement-breakpoint
ALTER TABLE `placeToPlaceCategory` ADD PRIMARY KEY(`categoryId`,`placeId`);