import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskItem } from "./TaskItem";
import type { Task } from "../types/task";

describe("TaskItem", () => {
  const mockTask: Task = {
    id: "1",
    title: "Test task",
    completed: false,
    createdAt: Date.now(),
  };

  it("enters edit mode, allows editing, and validates input", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("textbox")).toHaveValue("Test task");

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Updated task");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(handleEdit).toHaveBeenCalledWith(mockTask.id, "Updated task");

    handleEdit.mockClear();
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "Changed");
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleEdit).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.clear(screen.getByRole("textbox"));
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(handleEdit).not.toHaveBeenCalled();
  });
});
