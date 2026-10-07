import type { Task } from "../types/task";

export const STORAGE_KEY = "taskManagerTasks";

function isValidTask(obj: unknown): obj is Task {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "title" in obj &&
    "completed" in obj &&
    "createdAt" in obj &&
    typeof (obj as Task).id === "string" &&
    typeof (obj as Task).title === "string" &&
    typeof (obj as Task).completed === "boolean" &&
    typeof (obj as Task).createdAt === "number"
  );
}

function isValidTaskArray(data: unknown): data is Task[] {
  return Array.isArray(data) && data.every(isValidTask);
}

export function getStoredTasks(): Task[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);

    if (!isValidTaskArray(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
}
