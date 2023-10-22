ALTER TABLE `account` MODIFY COLUMN `refresh_token` text;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `access_token` text;--> statement-breakpoint
ALTER TABLE `user` ADD `hashedPassword` varchar(255);--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_email_unique` UNIQUE(`email`);