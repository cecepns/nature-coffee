-- Add TikTok field to settings table
ALTER TABLE `settings`
  ADD COLUMN `tiktok` VARCHAR(255) NULL AFTER `instagram`;


