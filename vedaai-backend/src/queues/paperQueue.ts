import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis";

export interface PaperJobData {
  assignmentId: string;
}

// Single shared queue instance
export const paperQueue = new Queue<PaperJobData>("generate-paper", {
  connection: createRedisConnection() as any,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

paperQueue.on("error", (err) => {
  console.error("❌ Queue error:", err);
});

console.log("📋 BullMQ queue 'generate-paper' ready");
