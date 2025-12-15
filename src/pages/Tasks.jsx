import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    api.get("/tasks").then((res) => {
      setTasks(res.data);
    });
  }, []);

  const addTask = async () => {
    const res = await api.post("/tasks", { title });
    setTasks((prev) => [...prev, res.data]);
    setTitle("");
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((task) => task._id !== id));
  };

  const toggleTask = async (id) => {
    const res = await api.patch(`/tasks/${id}`);

    setTasks((prev) => prev.map((task) => (task._id === id ? res.data : task)));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
        className="flex gap-2 mb-4"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />

        <button type="submit" className="bg-blue-600 text-white px-4">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t._id}
            className={`flex justify-between items-center border p-2 rounded cursor-pointer ${
              t.completed ? "bg-green-100 line-through text-gray-500" : ""
            }`}
            onClick={() => toggleTask(t._id)}
          >
            <span>{t.title}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(t._id);
              }}
              className="text-red-600 hover:underline cursor-pointer"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
