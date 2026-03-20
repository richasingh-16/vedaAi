import { Assignment, CreateFormData } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function toAssignment(raw: Record<string, unknown>): Assignment {
    return {
        id: (raw.id || raw._id) as string,
        title: raw.title as string,
        subject: raw.subject as string,
        className: raw.className as string,
        chapter: (raw.chapter as string) || "",
        dueDate: raw.dueDate as string,
        assignedOn: (raw.assignedOn || raw.createdAt) as string,
        questionTypes: raw.questionTypes as Assignment["questionTypes"],
        instructions: (raw.instructions as string) || "",
        status: raw.status as Assignment["status"],
        result: raw.result as Assignment["result"],
    };
}

export async function createAssignment(formData: CreateFormData): Promise<Assignment> {
    const body = {
        title: formData.title,
        subject: formData.subject,
        className: formData.className,
        chapter: formData.chapter,
        dueDate: formData.dueDate,
        questionTypes: formData.questionTypes.map(({ type, numberOfQuestions, marksPerQuestion }) => ({
            type, numberOfQuestions, marksPerQuestion,
        })),
        instructions: formData.instructions,
    };

    const res = await fetch(`${API_URL}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to create assignment");
    return toAssignment(json.data);
}

export async function fetchAssignments(): Promise<Assignment[]> {
    const res = await fetch(`${API_URL}/assignments`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch assignments");
    return (json.data as Record<string, unknown>[]).map(toAssignment);
}

export async function fetchAssignment(id: string): Promise<Assignment> {
    const res = await fetch(`${API_URL}/assignments/${id}`);
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Assignment not found");
    return toAssignment(json.data);
}

export async function deleteAssignment(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/assignments/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
}

export async function regenerateAssignment(id: string): Promise<Assignment> {
    const res = await fetch(`${API_URL}/assignments/${id}/regenerate`, { method: "POST" });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to regenerate");
    return toAssignment(json.data);
}