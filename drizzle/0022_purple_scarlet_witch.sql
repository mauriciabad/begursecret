ALTER TABLE `feature` ADD `date` tinytext;--> statement-breakpoint
ALTER TABLE `feature` ADD `isBoatOnly` boolean;--> statement-breakpoint
ALTER TABLE `feature` ADD `trainingLevel` enum('noTraining','amateur','entryLevel','advanced','professional','elite');--> statement-breakpoint
ALTER TABLE `feature` ADD `hasMissingInfo` boolean;--> statement-breakpoint
ALTER TABLE `feature` ADD `height` int;--> statement-breakpoint
ALTER TABLE `feature` ADD `depth` int;--> statement-breakpoint
ALTER TABLE `feature` ADD `depthMin` int;--> statement-breakpoint
ALTER TABLE `feature` ADD `depthMax` int;--> statement-breakpoint
ALTER TABLE `feature` ADD `scubaDivingLevel` enum('discoverScubaDiving','openWater','advancedOpenWater','specialtyDiver','technicalDiver');--> statement-breakpoint
ALTER TABLE `feature` ADD `notThereAnymore` boolean;--> statement-breakpoint
ALTER TABLE `feature` ADD `hasBench` boolean;--> statement-breakpoint
ALTER TABLE `feature` ADD `howNarrow` enum('extremlyNarrow','narrow','extraSpace','wide','veryWide');--> statement-breakpoint
ALTER TABLE `feature` ADD `hasMissingInfoNotes` text;--> statement-breakpoint
ALTER TABLE `feature` ADD `notThereAnymoreNotes` text;--> statement-breakpoint
ALTER TABLE `feature_translation` ADD `hasMissingInfoNotes` text;--> statement-breakpoint
ALTER TABLE `feature_translation` ADD `notThereAnymoreNotes` text;--> statement-breakpoint
ALTER TABLE `placeCategory` ADD `order` int;--> statement-breakpoint
ALTER TABLE `place` ADD `importance` double;--> statement-breakpoint
ALTER TABLE `routeCategory` ADD `order` int;--> statement-breakpoint
ALTER TABLE `route` ADD `importance` double;