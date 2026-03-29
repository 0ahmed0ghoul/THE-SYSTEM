import { useState } from "react";
import { Calendar, Plus } from "lucide-react";

export default function CalendarPage() {
  const [events, setEvents] = useState([
    { id: 1, title: "Team Meeting", date: "2026-03-30" },
    { id: 2, title: "Project Deadline", date: "2026-04-02" },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event = {
      id: Date.now(),
      ...newEvent,
    };

    setEvents((prev) => [event, ...prev]);

    setNewEvent({ title: "", date: "" });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-slate-100">
          Calendar
        </h1>

        {/* Add Event */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-800 flex gap-3">
          <input
            type="text"
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            className="flex-1 p-2 rounded bg-slate-100 dark:bg-slate-800"
          />

          <input
            type="date"
            value={newEvent.date}
            onChange={(e) =>
              setNewEvent({ ...newEvent, date: e.target.value })
            }
            className="p-2 rounded bg-slate-100 dark:bg-slate-800"
          />

          <button
            onClick={handleAddEvent}
            className="bg-black text-white px-4 rounded flex items-center gap-1"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Events List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-sm p-4 space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
            >
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">
                  {event.title}
                </p>
                <p className="text-sm text-slate-400">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

              <Calendar size={18} className="text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}