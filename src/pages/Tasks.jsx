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

      <ul>
        {Array.isArray(tasks) &&
          tasks.map((t) => <li key={t._id}>{t.title}</li>)}
      </ul>
    </div>
  );
}
