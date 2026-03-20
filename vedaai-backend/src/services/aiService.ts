import { v4 as uuidv4 } from "uuid";
import { CreateAssignmentInput, AssignmentResult, Section, Question } from "../types";

function buildPrompt(input: CreateAssignmentInput): string {
  const sections = input.questionTypes
    .map(
      (qt, i) =>
        `- Section ${String.fromCharCode(65 + i)}: ${qt.numberOfQuestions} x ${qt.type} (${qt.marksPerQuestion} mark${qt.marksPerQuestion > 1 ? "s" : ""} each)`
    )
    .join("\n");

  const totalMarks = input.questionTypes.reduce(
    (sum, qt) => sum + qt.numberOfQuestions * qt.marksPerQuestion,
    0
  );

  return `You are an expert teacher creating a structured question paper.

Generate a question paper for:
- Subject: ${input.subject}
- Class: ${input.className}
- Chapter/Topic: ${input.chapter}
- Total Marks: ${totalMarks}
${input.instructions ? `- Special Instructions: ${input.instructions}` : ""}
${input.fileContent ? `- Reference Material: ${input.fileContent}` : ""}

Structure:
${sections}

Rules:
1. Each question must be specific and relevant to ${input.subject} for Class ${input.className}
2. Distribute difficulty: roughly 40% easy, 40% moderate, 20% challenging per section
3. For MCQ questions, provide exactly 4 options in format: ["A. option", "B. option", "C. option", "D. option"]
4. For non-MCQ questions, use options: []
5. Provide a concise model answer in the answerKey for every question
6. Use unique IDs like q1, q2, q3 across all sections

CRITICAL: Respond with ONLY valid JSON. No markdown, no backticks, no explanation.

JSON Schema:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks.",
      "questions": [
        {
          "id": "q1",
          "text": "question text",
          "type": "question type",
          "difficulty": "easy",
          "marks": 2,
          "options": []
        }
      ]
    }
  ],
  "answerKey": [
    { "questionId": "q1", "answer": "model answer" }
  ]
}

Use exactly: "easy", "moderate", or "challenging" for difficulty.`;
}

function parseResponse(
  raw: string,
  input: CreateAssignmentInput
): Pick<AssignmentResult, "sections" | "answerKey"> {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/gi, "")
    .trim();

  let parsed: { sections: Section[]; answerKey: { questionId: string; answer: string }[] };

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Invalid JSON from AI. Preview: ${cleaned.slice(0, 200)}`);
  }

  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error("AI response missing 'sections' array");
  }

  const sections: Section[] = parsed.sections.map((section, sIdx) => {
    const questionType = input.questionTypes[sIdx];
    return {
      title: section.title || `Section ${String.fromCharCode(65 + sIdx)}`,
      instruction: section.instruction || "Attempt all questions.",
      questions: (section.questions || []).map((q: Question) => ({
        id: q.id || uuidv4(),
        text: q.text || "Question text missing",
        type: q.type || questionType?.type || "General",
        difficulty: (["easy", "moderate", "challenging"].includes(q.difficulty)
          ? q.difficulty
          : "moderate") as Question["difficulty"],
        marks: typeof q.marks === "number" ? q.marks : questionType?.marksPerQuestion || 1,
        options: Array.isArray(q.options) ? q.options : [],
      })),
    };
  });

  return {
    sections,
    answerKey: Array.isArray(parsed.answerKey) ? parsed.answerKey : [],
  };
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty response");

  console.log(`✅ Gemini responded (${text.length} chars)`);
  return text;
}

async function callGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert teacher. Always respond with valid JSON only. No markdown, no backticks, no explanation.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned empty response");

  console.log(`✅ Groq responded (${text.length} chars)`);
  return text;
}

export async function generateQuestionPaper(
  input: CreateAssignmentInput
): Promise<AssignmentResult> {
  const prompt = buildPrompt(input);
  const totalMarks = input.questionTypes.reduce(
    (sum, qt) => sum + qt.numberOfQuestions * qt.marksPerQuestion,
    0
  );

  let rawText: string;

  try {
    console.log("🤖 Calling Gemini 1.5 Flash (primary)...");
    rawText = await callGemini(prompt);
  } catch (geminiErr) {
    console.warn(`⚠️  Gemini failed: ${(geminiErr as Error).message}`);
    console.log("🔄 Falling back to Groq (Llama 3.1 70B)...");

    try {
      rawText = await callGroq(prompt);
    } catch (groqErr) {
      throw new Error(
        `Both AI providers failed.\nGemini: ${(geminiErr as Error).message}\nGroq: ${(groqErr as Error).message}`
      );
    }
  }

  const { sections, answerKey } = parseResponse(rawText, input);

  return {
    schoolName: "Delhi Public School, Sector-4, Bokaro",
    subject: input.subject,
    className: input.className,
    timeAllowed: `${Math.max(30, Math.ceil(totalMarks * 1.5))} minutes`,
    maxMarks: totalMarks,
    generalInstruction:
      input.instructions || "All questions are compulsory unless stated otherwise.",
    sections,
    answerKey,
  };
}
