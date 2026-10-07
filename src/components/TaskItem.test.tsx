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

  it("saves task when Enter is pressed during edit", async () => {
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
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Updated with Enter");
    await user.keyboard("{Enter}");

    expect(handleEdit).toHaveBeenCalledWith(mockTask.id, "Updated with Enter");
  });

  it("cancels edit when Escape is pressed", async () => {
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
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Changed text");
    await user.keyboard("{Escape}");

    expect(handleEdit).not.toHaveBeenCalled();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows validation error when trying to save empty title", async () => {
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
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/task title cannot be empty/i)).toBeInTheDocument();
    expect(handleEdit).not.toHaveBeenCalled();
    expect(input).toBeInTheDocument();
  });

  it("clears validation error when user types valid text", async () => {
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
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/task title cannot be empty/i)).toBeInTheDocument();

    await user.type(input, "Valid task");

    expect(screen.queryByText(/task title cannot be empty/i)).not.toBeInTheDocument();
  });

  it("shows validation error when pressing Enter with empty title", async () => {
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
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.keyboard("{Enter}");

    expect(screen.getByText(/task title cannot be empty/i)).toBeInTheDocument();
    expect(handleEdit).not.toHaveBeenCalled();
    expect(input).toBeInTheDocument();
  });
});
