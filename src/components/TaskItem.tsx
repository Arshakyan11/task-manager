import { useState } from "react";
import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setError("Task title cannot be empty");
      return;
    }
    onEdit(task.id, trimmedTitle);
    setIsEditing(false);
    setError("");
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleChange = (value: string) => {
    setEditTitle(value);
    if (error) {
      setError("");
    }
  };

  if (isEditing) {
    return (
      <li>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {error && <span className="error" style={{ fontSize: "0.75rem" }}>{error}</span>}
        </div>
        <div className="task-actions">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={task.completed ? "completed" : ""}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Toggle ${task.title}`}
      />
      <span
        className={task.completed ? "task-content completed" : "task-content"}
      >
        {task.title}
      </span>
      <div className="task-actions">
        <button
          onClick={() => setIsEditing(true)}
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
