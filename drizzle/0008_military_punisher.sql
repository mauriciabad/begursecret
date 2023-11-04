CREATE TABLE `feature` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`amountOfPeople` enum('none','few','some','many','crowded'),
	`difficulty` enum('accessible','normal','smallEffort','hard','dangerous'),
	`groundType` enum('sand','pebbles','rocks','concrete'),
	`hasBus` boolean,
	`hasParking` boolean,
	`hasToilet` boolean,
	`hasRestaurant` boolean,
	`hasDrinkingWater` boolean,
	`hasShower` boolean,
	`hasLifeguard` boolean,
	`hasLeisure` boolean,
	`dimensions` tinytext,
	`difficultyNotes` text,
	CONSTRAINT `feature_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feature_translation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`feature_id` int NOT NULL,
	`locale` varchar(10) NOT NULL,
	`difficultyNotes` text,
	CONSTRAINT `feature_translation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `place` ADD `featuresId` int;--> statement-breakpoint
ALTER TABLE `place` ADD `description` tinytext;--> statement-breakpoint
ALTER TABLE `place` ADD `content` text;--> statement-breakpoint
ALTER TABLE `place_translation` ADD `description` tinytext;--> statement-breakpoint
ALTER TABLE `place_translation` ADD `content` text;