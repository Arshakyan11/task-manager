import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { setStoredTasks, STORAGE_KEY } from "./utils/storage";
import type { Task } from "./types/task";

describe("App integration tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("handles full task lifecycle: add, toggle, edit, delete", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("textbox"), "Task 1{Enter}");
    await user.type(screen.getByRole("textbox"), "Task 2{Enter}");
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();

    const task1Item = screen.getByText("Task 1").closest("li")!;
    const checkbox = within(task1Item).getByRole("checkbox");
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByText("Task 1")).toHaveClass("completed");

    const editButton = within(task1Item).getByRole("button", { name: /edit/i });
    await user.click(editButton);
    const editInput = within(task1Item).getByRole("textbox");
    await user.clear(editInput);
    await user.type(editInput, "Updated Task 1");
    await user.click(within(task1Item).getByRole("button", { name: /save/i }));
    expect(screen.getByText("Updated Task 1")).toBeInTheDocument();

    await user.click(
      within(screen.getByText("Task 2").closest("li")!).getByRole("button", {
        name: /delete/i,
      }),
    );
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  it("filters tasks correctly and shows appropriate empty states", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();

    await user.type(screen.getByRole("textbox"), "Active task{Enter}");
    await user.type(screen.getByRole("textbox"), "Completed task{Enter}");
    const completedTaskItem = screen.getByText("Completed task").closest("li")!;
    await user.click(within(completedTaskItem).getByRole("checkbox"));

    await user.click(screen.getByRole("button", { name: /^active$/i }));
    expect(screen.getByText("Active task")).toBeInTheDocument();
    expect(screen.queryByText("Completed task")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^completed$/i }));
    expect(screen.queryByText("Active task")).not.toBeInTheDocument();
    expect(screen.getByText("Completed task")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^all$/i }));
    expect(screen.getByText("Active task")).toBeInTheDocument();
    expect(screen.getByText("Completed task")).toBeInTheDocument();
  });

  it("persists tasks to localStorage and loads on mount", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.type(screen.getByRole("textbox"), "Persistent task{Enter}");
    unmount();

    render(<App />);
    expect(screen.getByText("Persistent task")).toBeInTheDocument();
  });

  it("loads existing tasks from localStorage on mount", () => {
    const existingTasks: Task[] = [
      { id: "1", title: "Existing task", completed: true, createdAt: 1000 },
    ];
    setStoredTasks(existingTasks);

    render(<App />);
    expect(screen.getByText("Existing task")).toBeInTheDocument();
  });

  it("handles malformed localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "invalid json{");

    render(<App />);
    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
  });

  it("validates form input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument();
  });
});
