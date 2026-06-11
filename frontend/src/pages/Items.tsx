import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Items() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    "pending",
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch items function (defined inside component)
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load - using empty dependency array + flag to prevent multiple calls
  useEffect(() => {
    const fetch = async () => {
      fetchItems();
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Empty array is intentional here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingId !== null) {
        await api.put(`/items/${editingId}`, { title, status });
      } else {
        await api.post("/items", { title, status });
      }

      setTitle("");
      setEditingId(null);
      await fetchItems(); // Refresh list after create/update
    } catch (err) {
      console.error(err);
      alert("Operation failed. Please try again.");
    }
  };

  const handleEdit = (item: any) => {
    setTitle(item.title);
    setStatus(item.status);
    setEditingId(item.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/items/${id}`);
      await fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-10">
      <div>
        <h1 className="text-3xl font-bold mb-8">Items Management</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 space-y-4"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Item Title"
          className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {editingId ? "Update Item" : "Create Item"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle("");
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Items List */}
      <div className="bg-white rounded-xl shadow">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : items.length === 0 ? (
          <p className="p-12 text-center text-gray-500">
            No items found. Create your first item above.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="border-b last:border-b-0 p-6 flex justify-between items-start hover:bg-gray-50"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <div className="text-sm text-gray-500 mt-1 flex flex-col">
                  <span className="font-medium">
                    Created by {item.createdUser}
                  </span>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full
                  ${
                    item.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : item.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700 font-medium cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
