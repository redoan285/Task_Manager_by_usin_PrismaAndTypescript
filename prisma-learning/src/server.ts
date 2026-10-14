
import "dotenv/config";
import express from "express";
import { PrismaClient } from "../generated/prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static("public"));

// app.get("/", (_req, res) => {
//   res.send("Task Manager API is running!");
// });

app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({
        message: "Task title is required",
      });
      return;
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      res.status(400).json({
        message: "Description must be a string",
      });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    });

    res.status(201).json({
      message: "Task saved successfully!",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save task",
    });
  }
});

app.get("/tasks", async (_req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

const server = app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
}

process.on("SIGINT", () => {
  void shutdown();
});
