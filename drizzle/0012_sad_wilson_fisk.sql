ALTER TABLE `account` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `verificationToken` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `placeListToPlace` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `placeToPlaceCategory` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `account` ADD PRIMARY KEY(`provider`,`providerAccountId`);--> statement-breakpoint
ALTER TABLE `verificationToken` ADD PRIMARY KEY(`identifier`,`token`);--> statement-breakpoint
ALTER TABLE `placeListToPlace` ADD PRIMARY KEY(`placeId`,`placeListId`);--> statement-breakpoint
ALTER TABLE `placeToPlaceCategory` ADD PRIMARY KEY(`categoryId`,`placeId`);--> statement-breakpoint
ALTER TABLE `user` ADD `role` varchar(255) DEFAULT 'user' NOT NULL;