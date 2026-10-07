import { useState } from "react";

interface TaskFormProps {
  onSubmit: (title: string) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title cannot be empty");
      return;
    }

    onSubmit(trimmedTitle);
    setTitle("");
    setError("");
  };

  const handleChange = (value: string) => {
    setTitle(value);
    if (error) {
      setError("");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-wrapper">
        <input
          type="text"
          value={title}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Add a new task..."
          aria-label="New task"
        />
        <button type="submit">Add Task</button>
      </div>
      <div className="error-container">
        {error && <p className="error">{error}</p>}
      </div>
    </form>
  );
}
