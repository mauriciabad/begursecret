CREATE TABLE `verificationRequirement` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`isLocationRequired` boolean NOT NULL DEFAULT true,
	`maxLocationDistance` int,
	CONSTRAINT `verificationRequirement_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`placeId` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	`validatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deviceLocation` POINT SRID 25831,
	`deviceLocationAccuracy` int,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `place` ADD `verificationRequirementsId` int;