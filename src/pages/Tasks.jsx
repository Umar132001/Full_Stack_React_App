import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Fetch tasks with pagination & filter
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const params = { page, limit: 5 };
      if (filter !== "all") params.completed = filter;

      const res = await api.get("/tasks", { params });

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filter]);

  const validate = () => {
    if (!title.trim()) return "Task is required";
    if (title.length < 3) return "Min 3 characters";
    return "";
  };

  const addTask = async () => {
    const error = validate();
    if (error) return toast.error(error);

    try {
      await api.post("/tasks", { title });

      toast.success("Task added");
      setTitle("");
      setPage(1);
      fetchTasks();
    } catch {
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    const prev = tasks;
    setTasks(tasks.filter((t) => t._id !== id));

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      toast.success("Task deleted");
    } catch {
      setTasks(prev);
      toast.error("Delete failed");
    }
  };

  const toggleTask = async (id) => {
    const prev = tasks;
    setTasks((tasks) =>
      tasks.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      await api.patch(`/tasks/${id}`);
    } catch {
      setTasks(prev);
      toast.error("Update failed");
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const saveEdit = async (id) => {
    if (editTitle.trim().length < 3) {
      return toast.error("Min 3 characters required");
    }

    try {
      const res = await api.patch(`/tasks/${id}/title`, {
        title: editTitle,
      });

      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));

      toast.success("Task updated");
      cancelEdit();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

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
          placeholder="New task..."
          className="border p-2 flex-1 rounded"
        />
        <button className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>

      <select
        value={filter}
        onChange={(e) => {
          setPage(1);
          setFilter(e.target.value);
        }}
        className="border p-2 mb-4"
      >
        <option value="all">All</option>
        <option value="true">Completed</option>
        <option value="false">Pending</option>
      </select>

      {loading ? (
        <ul className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="h-10 bg-gray-200 animate-pulse rounded" />
          ))}
        </ul>
      ) : (
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li
              key={t._id}
              className={`p-2 border rounded flex justify-between items-center ${
                t.completed ? "bg-green-100 line-through text-gray-500" : ""
              }`}
            >
              {editingId === t._id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border p-1 flex-1 mr-2"
                  autoFocus
                />
              ) : (
                <span
                  className="flex-1 cursor-pointer"
                  onClick={() => toggleTask(t._id)}
                >
                  {t.title}
                </span>
              )}

              <div className="flex gap-2 ml-2">
                {editingId === t._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(t._id)}
                      className="text-green-600"
                    >
                      Save
                    </button>
                    <button onClick={cancelEdit} className="text-gray-500">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(t)}
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(t._id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
