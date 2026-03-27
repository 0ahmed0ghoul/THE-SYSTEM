import { useState } from "react";

export default function CreateProjectModal({
  onCreate,
  loading,
}: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = () => {
    if (!form.name) return;
    onCreate(form);
    setForm({ name: "", description: "" });
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-black text-white px-4 py-2 rounded"
      >
        + New Project
      </button>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow w-80">
      <h3 className="font-bold mb-2">Create Project</h3>

      <input
        placeholder="Name"
        className="w-full mb-2 p-2 border rounded"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <textarea
        placeholder="Description"
        className="w-full mb-2 p-2 border rounded"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-3 py-1 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}