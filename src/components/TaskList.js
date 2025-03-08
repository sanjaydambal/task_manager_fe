import { useEffect, useState } from "react";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create Task
  const addTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/tasks", {
        title: newTask.title,
        description: newTask.description,
        status: "Pending",
      });
      setTasks([...tasks, res.data]); // Add new task to state
      setNewTask({ title: "", description: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Update Task Status
  const updateTask = async (id, newStatus) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id);
      if (!taskToUpdate) return;

      await axios.put(`http://localhost:5000/tasks/${id}`, {
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        status: newStatus,
      });

      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Task Manager</h2>

      {/* Create Task Form */}
      <div className="mb-4 p-4 border rounded">
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-2 border mb-2 rounded"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task Description"
          className="w-full p-2 border mb-2 rounded"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 mb-2 border rounded flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p
                className={`font-bold ${
                  task.status === "Completed"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              >
                {task.status}
              </p>
            </div>
            <div className="flex gap-2">
              {task.status !== "Completed" && (
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => updateTask(task.id, "Completed")}
                >
                  Complete
                </button>
              )}
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
