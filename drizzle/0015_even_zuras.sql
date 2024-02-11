ALTER TABLE `feature` MODIFY COLUMN `groundType` enum('sand','pebbles','rocks','concrete','dirt','pavimented');--> statement-breakpoint
ALTER TABLE `feature` ADD `parkingSpaces` int;--> statement-breakpoint
ALTER TABLE `feature` ADD `price` double;--> statement-breakpoint
ALTER TABLE `feature` ADD `priceUnit` enum('eur','eur/minute','eur/hour','eur/day');--> statement-breakpoint
ALTER TABLE `feature` ADD `isCovered` boolean;--> statement-breakpoint
ALTER TABLE `feature` ADD `timeToArrive` int;--> statement-breakpoint
ALTER TABLE `feature` ADD `placeToArriveFrom` enum('townCenter','parking','beach','road');--> statement-breakpoint
ALTER TABLE `feature` ADD `isFreeWithLocalStamp` boolean;--> statement-breakpoint
ALTER TABLE `feature` ADD `priceNotes` text;--> statement-breakpoint
ALTER TABLE `feature_translation` ADD `priceNotes` text;