import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRIZE_CATEGORIES = [
  {
    name: "Fur-right Night Award",
    subcategory: "Spookiest Costume",
    sortOrder: 1,
  },
  {
    name: "The Best Furiends Award",
    subcategory: "Best Duo or Group",
    sortOrder: 2,
  },
  {
    name: "Paws-itively Hilarious",
    subcategory: "Most Hilarious Costume",
    sortOrder: 3,
  },
  {
    name: "Pup Culture Award",
    subcategory: "Best TV, Film, Music, Celebrity Costume",
    sortOrder: 4,
  },
  {
    name: "Best in Show",
    subcategory: "Overall Winner",
    sortOrder: 5,
  },
];

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", votingOpen: false },
    update: {},
  });

  await prisma.dogCounter.upsert({
    where: { id: "global" },
    create: { id: "global", count: 0 },
    update: {},
  });

  for (const category of PRIZE_CATEGORIES) {
    const existing = await prisma.prizeCategory.findFirst({
      where: { sortOrder: category.sortOrder },
    });
    if (!existing) {
      await prisma.prizeCategory.create({ data: category });
    }
  }

  const roundOne = await prisma.round.findUnique({ where: { roundNumber: 1 } });
  if (!roundOne) {
    await prisma.round.create({
      data: { roundNumber: 1, status: "OPEN" },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
