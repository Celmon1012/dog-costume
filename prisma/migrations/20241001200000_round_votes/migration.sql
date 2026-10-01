-- CreateTable
CREATE TABLE "round_votes" (
    "id" TEXT NOT NULL,
    "dog_id" TEXT NOT NULL,
    "round_number" INTEGER NOT NULL,
    "voter_identifier" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "round_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "round_votes_round_number_voter_identifier_key" ON "round_votes"("round_number", "voter_identifier");

-- CreateIndex
CREATE INDEX "round_votes_dog_id_idx" ON "round_votes"("dog_id");

-- AddForeignKey
ALTER TABLE "round_votes" ADD CONSTRAINT "round_votes_dog_id_fkey" FOREIGN KEY ("dog_id") REFERENCES "dogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
