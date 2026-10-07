import type { FilterType } from "../types/task";

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks">
      <button
        className={currentFilter === "all" ? "active" : ""}
        onClick={() => onFilterChange("all")}
        aria-current={currentFilter === "all" ? "true" : undefined}
      >
        All
      </button>
      <button
        className={currentFilter === "active" ? "active" : ""}
        onClick={() => onFilterChange("active")}
        aria-current={currentFilter === "active" ? "true" : undefined}
      >
        Active
      </button>
      <button
        className={currentFilter === "completed" ? "active" : ""}
        onClick={() => onFilterChange("completed")}
        aria-current={currentFilter === "completed" ? "true" : undefined}
      >
        Completed
      </button>
    </div>
  );
}
