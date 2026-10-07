import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("renders all three filter buttons", () => {
    render(<FilterBar currentFilter="all" onFilterChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /active/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /completed/i }),
    ).toBeInTheDocument();
  });

  it("highlights the active filter", () => {
    render(<FilterBar currentFilter="active" onFilterChange={vi.fn()} />);

    const activeButton = screen.getByRole("button", { name: /active/i });
    expect(activeButton).toHaveClass("active");
  });

  it("calls onFilterChange with correct filter when button is clicked", async () => {
    const user = userEvent.setup();
    const handleFilterChange = vi.fn();

    render(
      <FilterBar currentFilter="all" onFilterChange={handleFilterChange} />,
    );

    const activeButton = screen.getByRole("button", { name: /active/i });
    await user.click(activeButton);

    expect(handleFilterChange).toHaveBeenCalledWith("active");
  });

  it("calls onFilterChange for each filter button", async () => {
    const user = userEvent.setup();
    const handleFilterChange = vi.fn();

    render(
      <FilterBar currentFilter="all" onFilterChange={handleFilterChange} />,
    );

    await user.click(screen.getByRole("button", { name: /all/i }));
    expect(handleFilterChange).toHaveBeenCalledWith("all");

    await user.click(screen.getByRole("button", { name: /active/i }));
    expect(handleFilterChange).toHaveBeenCalledWith("active");

    await user.click(screen.getByRole("button", { name: /completed/i }));
    expect(handleFilterChange).toHaveBeenCalledWith("completed");
  });
});
