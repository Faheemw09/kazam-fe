import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Task {
  _id: string;
  name: string;
  status: "pending" | "completed";
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  createTask: (name: string) => void;
  updateTask: (id: string, status: "pending" | "completed") => void;
  deleteTask: (id: string) => void;
  fetchTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      //   console.log(token);
      const { data } = await axios.get(
        "https://kazam-backend-8uil.onrender.com/api/tasks/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //   console.log(data);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);
  const createTask = async (taskData: {
    title: string;
    description: string;
    status: "pending" | "completed";
    dueDate: any;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "https://kazam-backend-8uil.onrender.com/api/tasks/",
        {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          dueDate: taskData.dueDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prevTasks) => [...prevTasks, data]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async (id: string, status: "pending" | "completed") => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      console.log("Updating task with ID:", id, "to status:", status);

      const response = await axios.put(
        `http://localhost:8080/api/tasks/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );

      console.log("Task updated successfully:", response.data);
      fetchTasks();
    } catch (error) {
      if (error.response) {
        console.error("Error updating task:", error.response.data);
      } else {
        console.error("Error updating task:", error.message);
      }
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://kazam-backend-8uil.onrender.com/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, createTask, updateTask, deleteTask, fetchTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
