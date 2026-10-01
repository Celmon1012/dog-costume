-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('CLOSED', 'OPEN', 'COMPLETED');

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "voting_open" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dog_counters" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "dog_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rounds" (
    "id" TEXT NOT NULL,
    "round_number" INTEGER NOT NULL,
    "status" "RoundStatus" NOT NULL DEFAULT 'CLOSED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dogs" (
    "id" TEXT NOT NULL,
    "unique_id" TEXT NOT NULL,
    "dog_name" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "owner_email" TEXT NOT NULL,
    "owner_phone" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "costume_description" TEXT NOT NULL,
    "round_number" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,
    "is_finalist" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prize_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "prize_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "dog_id" TEXT NOT NULL,
    "prize_category_id" TEXT NOT NULL,
    "voter_identifier" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rounds_round_number_key" ON "rounds"("round_number");

-- CreateIndex
CREATE UNIQUE INDEX "dogs_unique_id_key" ON "dogs"("unique_id");

-- CreateIndex
CREATE INDEX "dogs_round_number_idx" ON "dogs"("round_number");

-- CreateIndex
CREATE INDEX "dogs_is_finalist_idx" ON "dogs"("is_finalist");

-- CreateIndex
CREATE UNIQUE INDEX "prize_categories_sort_order_key" ON "prize_categories"("sort_order");

-- CreateIndex
CREATE INDEX "votes_dog_id_idx" ON "votes"("dog_id");

-- CreateIndex
CREATE UNIQUE INDEX "votes_prize_category_id_voter_identifier_key" ON "votes"("prize_category_id", "voter_identifier");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_prize_category_id_fkey" FOREIGN KEY ("prize_category_id") REFERENCES "prize_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
