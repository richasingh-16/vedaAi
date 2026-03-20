import { Router, Request, Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { Assignment } from "../models/Assignment";
import { paperQueue } from "../queues/paperQueue";

const router = Router();

// ── Validation Schema ─────────────────────────────────────────────────────────
const QuestionTypeSchema = z.object({
  type: z.string().min(1, "Question type is required"),
  numberOfQuestions: z
    .number()
    .int()
    .min(1, "Must have at least 1 question"),
  marksPerQuestion: z
    .number()
    .int()
    .min(1, "Marks must be at least 1"),
});

const CreateAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subject: z.string().min(1, "Subject is required").max(100),
  className: z.string().min(1, "Class is required").max(50),
  chapter: z.string().min(1, "Chapter / topic is required").max(200),
  dueDate: z.string().max(100).optional().default(""),
  questionTypes: z
    .array(QuestionTypeSchema)
    .min(1, "At least one question type is required"),
  instructions: z.string().max(1000).optional().default(""),
  fileContent: z.string().optional(),
});

// ── POST /assignments ─────────────────────────────────────────────────────────
router.post(
  "/",
  validate(CreateAssignmentSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Create assignment in DB with status: pending
      const assignment = new Assignment({
        ...req.body,
        status: "pending",
      });
      await assignment.save();

      // 2. Add job to BullMQ queue
      const job = await paperQueue.add(
        "generate",
        { assignmentId: assignment._id.toString() },
        { jobId: `paper-${assignment._id}` }
      );

      // 3. Save jobId reference
      assignment.jobId = job.id ?? undefined;
      await assignment.save();

      console.log(
        `📋 Assignment created: ${assignment._id} | Job: ${job.id}`
      );

      // 4. Return immediately with pending status
      res.status(201).json({
        success: true,
        data: assignment.toJSON(),
      });
    } catch (err) {
      console.error("POST /assignments error:", err);
      res.status(500).json({
        success: false,
        error: "Failed to create assignment",
      });
    }
  }
);

// ── GET /assignments ──────────────────────────────────────────────────────────
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const assignments = await Assignment.find()
      .sort({ createdAt: -1 })
      .select("-result -fileContent"); // Exclude heavy fields from list

    res.json({
      success: true,
      data: assignments.map((a) => a.toJSON()),
    });
  } catch (err) {
    console.error("GET /assignments error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch assignments" });
  }
});

// ── GET /assignments/:id ──────────────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }

    res.json({
      success: true,
      data: assignment.toJSON(),
    });
  } catch (err) {
    console.error(`GET /assignments/${req.params.id} error:`, err);
    res.status(500).json({ success: false, error: "Failed to fetch assignment" });
  }
});

// ── DELETE /assignments/:id ───────────────────────────────────────────────────
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }

    res.json({ success: true, message: "Assignment deleted" });
  } catch (err) {
    console.error(`DELETE /assignments/${req.params.id} error:`, err);
    res.status(500).json({ success: false, error: "Failed to delete assignment" });
  }
});

// ── POST /assignments/:id/regenerate ─────────────────────────────────────────
router.post("/:id/regenerate", async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }

    // Reset status and re-queue
    assignment.status = "pending";
    assignment.result = undefined;
    await assignment.save();

    const job = await paperQueue.add(
      "generate",
      { assignmentId: assignment._id.toString() },
      { jobId: `paper-${assignment._id}-regen-${Date.now()}` }
    );

    assignment.jobId = job.id ?? undefined;
    await assignment.save();

    res.json({
      success: true,
      data: assignment.toJSON(),
    });
  } catch (err) {
    console.error(`POST /assignments/${req.params.id}/regenerate error:`, err);
    res.status(500).json({ success: false, error: "Failed to regenerate" });
  }
});

export default router;
