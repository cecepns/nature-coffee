-- Add is_favorite field to menu table
ALTER TABLE `menu`
  ADD COLUMN `is_favorite` BOOLEAN DEFAULT FALSE AFTER `is_available`;

-- Create index for better performance when filtering favorites
CREATE INDEX idx_menu_favorite ON menu(is_favorite);
