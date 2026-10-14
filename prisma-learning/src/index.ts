import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const task = await prisma.task.create({
    data: {
      title: "Learn Prisma",
      description: "My first Prisma task",
    },
  });

  console.log("Task created successfully!");
  console.log(task);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });