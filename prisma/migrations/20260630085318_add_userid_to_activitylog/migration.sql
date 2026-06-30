-- AlterTable
ALTER TABLE `ActivityLog` ADD COLUMN `userId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `ActivityLog_userId_idx` ON `ActivityLog`(`userId`);
