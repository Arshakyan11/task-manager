import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import { FilterBar } from "./components/FilterBar";
import "./App.css";

function App() {
  const {
    filteredTasks,
    filter,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
  } = useTasks();

  const getEmptyStateIcon = () => {
    if (filter === "all" || filter === "active") {
      return (
        <svg viewBox="0 0 24 24">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  };

  const getEmptyStateTitle = () => {
    if (filter === "active") return "No active tasks";
    if (filter === "completed") return "No completed tasks";
    return "No tasks yet";
  };

  const getEmptyStateDescription = () => {
    if (filter === "active") return "All tasks are completed!";
    if (filter === "completed") return "Complete a task to see it here";
    return "Add your first task above to get started";
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <p className="app-subtitle">Organize your work and stay focused.</p>

      <div className="app-card">
        <TaskForm onSubmit={addTask} />

        <div className="filter-bar-wrapper">
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </div>

        <div className="task-content-area">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true">
                {getEmptyStateIcon()}
              </div>
              <h2 className="empty-state-title">{getEmptyStateTitle()}</h2>
              <p className="empty-state-message">
                {getEmptyStateDescription()}
              </p>
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={updateTask}
                  onDelete={deleteTask}
                />
              ))}
            </ul>
          )}
        </div>

        <footer className="app-footer">
          <div className="app-footer-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          </div>
          <span>Changes are saved automatically</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
