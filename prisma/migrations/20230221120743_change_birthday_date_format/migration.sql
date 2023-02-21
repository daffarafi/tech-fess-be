-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "birthdate" SET DATA TYPE DATE;
