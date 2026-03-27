export default function Dashboard() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome 👋</h1>
  
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            Projects: 0
          </div>
  
          <div className="bg-white p-4 rounded shadow">
            Tasks: 0
          </div>
  
          <div className="bg-white p-4 rounded shadow">
            Completed: 0
          </div>
        </div>
      </div>
    );
  }