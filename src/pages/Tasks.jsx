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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Task Manager
            </h2>
            <p className="text-blue-100 mt-2">
              Stay organized and get things done
            </p>
          </div>

          {/* Card Content */}
          <div className="p-8">
            {/* Add Task Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTask();
              }}
              className="mb-6"
            >
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Add Task
                </button>
              </div>
            </form>

            {/* Filter Dropdown */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                <svg
                  className="w-5 h-5 text-gray-500 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                <select
                  value={filter}
                  onChange={(e) => {
                    setPage(1);
                    setFilter(e.target.value);
                  }}
                  className="bg-transparent border-none outline-none px-2 py-2 text-gray-700 font-medium cursor-pointer"
                >
                  <option value="all">All Tasks</option>
                  <option value="true">Completed</option>
                  <option value="false">Pending</option>
                </select>
              </div>
            </div>

            {/* Tasks List */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-gray-500 text-lg">No tasks found</p>
                <p className="text-gray-400">Add a new task to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((t) => (
                  <div
                    key={t._id}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                      t.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {editingId === t._id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(t._id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex-1 cursor-pointer transition-all duration-200 ${
                            t.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800 hover:text-blue-600"
                          }`}
                          onClick={() => toggleTask(t._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                t.completed
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {t.completed && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium">{t.title}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 ml-4">
                        {editingId === t._id ? (
                          <>
                            <button
                              onClick={() => saveEdit(t._id)}
                              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(t)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTask(t._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">
                    Page {page} of {totalPages}
                  </span>
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
