import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "./TaskForm";

describe("TaskForm", () => {
  it("submits valid input and clears field", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<TaskForm onSubmit={handleSubmit} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "Task via Enter{Enter}");
    expect(handleSubmit).toHaveBeenCalledWith("Task via Enter");
    expect(input).toHaveValue("");

    await user.type(input, "  Task via button  ");
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(handleSubmit).toHaveBeenCalledWith("Task via button");
    expect(input).toHaveValue("");
  });

  it("validates input and shows/clears error messages", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<TaskForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument();

    await user.type(screen.getByRole("textbox"), "T");
    expect(screen.queryByText(/cannot be empty/i)).not.toBeInTheDocument();

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
