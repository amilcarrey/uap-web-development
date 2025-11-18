import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.createMany({
    data: [
      { title: "Comprar leche", priority: "low", category: "shopping", completed: false },
      { title: "Terminar entrega P4", priority: "high", category: "work", completed: false },
      { title: "Hacer ejercicio", priority: "medium", category: "health", completed: true },
    ],
  });
  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
