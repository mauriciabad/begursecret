CREATE TABLE `externalLink` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`isOfficialWebsite` boolean,
	`url` text NOT NULL,
	`title` tinytext,
	CONSTRAINT `externalLink_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `externalLink_translation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`externalLink_id` int NOT NULL,
	`locale` varchar(10) NOT NULL,
	`url` text NOT NULL,
	`title` tinytext,
	CONSTRAINT `externalLink_translation_id` PRIMARY KEY(`id`)
);
