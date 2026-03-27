import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6">Workflow</h1>

      <button
        onClick={() => navigate("/")}
        className="text-left mb-3 hover:bg-gray-800 p-2 rounded"
      >
        Dashboard
      </button>

      <button
        onClick={() => navigate("/projects")}
        className="text-left mb-3 hover:bg-gray-800 p-2 rounded"
      >
        Projects
      </button>

      <button
        onClick={() => navigate("/board")}
        className="text-left mb-3 hover:bg-gray-800 p-2 rounded"
      >
        Board
      </button>
    </div>
  );
}