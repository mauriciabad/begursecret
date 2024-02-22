ALTER TABLE `feature` ADD `isNudist` boolean;--> statement-breakpoint
ALTER TABLE `feature` ADD `hasUnofficialName` boolean;--> statement-breakpoint
ALTER TABLE `feature` ADD `isOutOfTheMunicipality` boolean;--> statement-breakpoint
ALTER TABLE `feature` ADD `allowedAccess` enum('public','permissive','customers','permit','private','mixed');--> statement-breakpoint
ALTER TABLE `feature` ADD `duration` int;--> statement-breakpoint
ALTER TABLE `feature` ADD `distance` int;--> statement-breakpoint
ALTER TABLE `feature` ADD `slope` int;--> statement-breakpoint
ALTER TABLE `feature` ADD `allowedAccessNotes` text;--> statement-breakpoint
ALTER TABLE `feature_translation` ADD `allowedAccessNotes` text;