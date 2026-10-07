import { useState, useEffect } from "react";
import type { FilterType, Task } from "../types/task";
import { getStoredTasks, setStoredTasks } from "../utils/storage";

interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  filter: FilterType;
  addTask: (title: string) => void;
  updateTask: (id: string, title: string) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: FilterType) => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const storedTasks = getStoredTasks();
    if (storedTasks) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTasks(storedTasks);
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    setStoredTasks(newTasks);
  };

  const addTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
    };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, title: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, title } : task,
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return {
    tasks,
    filteredTasks,
    filter,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
  };
}
