import "dotenv/config";
import { Worker, Job } from "bullmq";
import { createRedisConnection } from "../config/redis";
import { connectDB } from "../config/db";
import { Assignment } from "../models/Assignment";
import { generateQuestionPaper } from "../services/aiService";
import { emitToAssignment } from "../socket/wsHandler";
import { PaperJobData } from "./paperQueue";

async function processJob(job: Job<PaperJobData>): Promise<void> {
  const { assignmentId } = job.data;

  console.log(`⚙️  Processing job ${job.id} for assignment ${assignmentId}`);

  // 1. Fetch assignment from DB
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error(`Assignment ${assignmentId} not found`);
  }

  // 2. Mark as processing + notify frontend
  assignment.status = "processing";
  await assignment.save();

  emitToAssignment(assignmentId, {
    type: "assignment:processing",
    assignmentId,
  });

  await job.updateProgress(10);

  // 3. Generate question paper via AI
  const result = await generateQuestionPaper({
    title: assignment.title,
    subject: assignment.subject,
    className: assignment.className,
    chapter: assignment.chapter,
    dueDate: assignment.dueDate,
    questionTypes: assignment.questionTypes,
    instructions: assignment.instructions,
    fileContent: assignment.fileContent,
  });

  await job.updateProgress(90);

  // 4. Store result in MongoDB
  assignment.status = "completed";
  assignment.result = result;
  await assignment.save();

  await job.updateProgress(100);

  // 5. Notify frontend via WebSocket
  emitToAssignment(assignmentId, {
    type: "assignment:completed",
    assignmentId,
    payload: result,
  });

  console.log(`✅ Job ${job.id} completed for assignment ${assignmentId}`);
}

async function startWorker(): Promise<void> {
  await connectDB();

  const worker = new Worker<PaperJobData>("generate-paper", processJob, {
    connection: createRedisConnection(),
    concurrency: 2, // Process up to 2 jobs in parallel
  });

  worker.on("completed", (job) => {
    console.log(`✅ Worker completed job ${job.id}`);
  });

  worker.on("failed", async (job, err) => {
    console.error(`❌ Worker failed job ${job?.id}:`, err.message);

    if (job?.data.assignmentId) {
      try {
        await Assignment.findByIdAndUpdate(job.data.assignmentId, {
          status: "failed",
        });

        emitToAssignment(job.data.assignmentId, {
          type: "assignment:failed",
          assignmentId: job.data.assignmentId,
          payload: { error: err.message },
        });
      } catch (dbErr) {
        console.error("Failed to update assignment status:", dbErr);
      }
    }
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
  });

  console.log("🚀 Worker started — listening for jobs on 'generate-paper'");

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received — shutting down worker");
    await worker.close();
    process.exit(0);
  });
}

startWorker().catch((err) => {
  console.error("Failed to start worker:", err);
  process.exit(1);
});
