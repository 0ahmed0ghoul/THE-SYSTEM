// frontend/src/features/calendar/CalendarPage.tsx
import { useState, useEffect, type DragEvent } from "react";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle2,
  X,
  Trash2,
  Edit2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Repeat,
  Link2,
} from "lucide-react";
import { useTaskStore } from "../store/taskStore";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time?: string;
  description?: string;
  location?: string;
  priority?: "low" | "medium" | "high";
  type?: "mission" | "meeting" | "deadline" | "training";
  attendees?: string[];
  completed?: boolean;
}

// ── Helper Functions ─────────────────────────────────────────────────────────
function getEventTypeStyle(type: string) {
  return {
    mission: "border-red-500/40 bg-red-500/5 text-red-400",
    meeting: "border-sky-500/40 bg-sky-500/5 text-sky-400",
    deadline: "border-amber-500/40 bg-amber-500/5 text-amber-400",
    training: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400",
  }[type] ?? "border-slate-500/40 bg-slate-500/5 text-slate-400";
}

function getPriorityStyle(priority: string) {
  return {
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-emerald-400",
  }[priority] ?? "text-slate-400";
}

export default function CalendarPage() {
  const { tasks, loadTasks, updateTask } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, title: "Abyssal Gate Recon", date: "2026-03-30", time: "09:00", type: "mission", priority: "high", location: "Sector 7", attendees: ["Alex", "Sarah"] },
    { id: 2, title: "Hunter Briefing", date: "2026-03-30", time: "14:00", type: "meeting", priority: "medium", location: "Command Center", attendees: ["Marcus", "Emily"] },
    { id: 3, title: "Equipment Maintenance", date: "2026-03-31", time: "10:30", type: "training", priority: "low", location: "Armory" },
    { id: 4, title: "S-Rank Gate Operation", date: "2026-04-02", time: "06:00", type: "mission", priority: "high", location: "Unknown Region", attendees: ["Full Squad"] },
    { id: 5, title: "Quarterly Review", date: "2026-04-05", time: "11:00", type: "meeting", priority: "medium", location: "War Room" },
    { id: 6, title: "New Hunter Induction", date: "2026-04-08", time: "13:00", type: "training", priority: "low", location: "Training Grounds" },
    { id: 7, title: "Clearance Report", date: "2026-04-10", type: "deadline", priority: "high" },
  ]);
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    type: "mission" as const,
    priority: "medium" as const,
    location: "",
    description: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [dragTaskId, setDragTaskId] = useState<number | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<string | null>(null);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const toDateKey = (value: Date | string) => {
    if (typeof value === "string") {
      return value.slice(0, 10);
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: Date[] = [];
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = toDateKey(date);
    return events.filter(event => event.date === dateStr);
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = toDateKey(date);
    return tasks.filter((task) => task.dueDate && toDateKey(task.dueDate) === dateStr);
  };

  const unscheduledTasks = tasks.filter((task) => !task.dueDate);

  const startTaskDrag = (taskId: number, event: DragEvent<HTMLElement>) => {
    event.dataTransfer.setData("text/task-id", String(taskId));
    event.dataTransfer.effectAllowed = "move";
    setDragTaskId(taskId);
  };

  const scheduleTaskOnDate = async (date: string, event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const rawTaskId = event.dataTransfer.getData("text/task-id");
    const taskId = Number(rawTaskId || dragTaskId);

    if (!taskId || Number.isNaN(taskId)) {
      setDropTargetDate(null);
      setDragTaskId(null);
      return;
    }

    await updateTask(taskId, { dueDate: date });
    setDropTargetDate(null);
    setDragTaskId(null);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    
    const event: CalendarEvent = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      priority: newEvent.priority,
      location: newEvent.location,
      description: newEvent.description,
    };
    
    setEvents([event, ...events]);
    setNewEvent({ title: "", date: "", time: "", type: "mission", priority: "medium", location: "", description: "" });
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
    setSelectedEvent(null);
  };

  const handleToggleComplete = (id: number) => {
    setEvents(events.map(e => 
      e.id === id ? { ...e, completed: !e.completed } : e
    ));
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const upcomingEvents = filteredEvents
    .filter(e => e.date >= new Date().toISOString().split('T')[0])
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const todayStr = toDateKey(new Date());

  return (
    <div className="sys-calendar-page min-h-screen bg-[#020c1a] font-['Rajdhani',sans-serif] text-[#e0f7fa] relative">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(79,195,247,0.055)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0" />
      <div className="fixed w-[900px] h-[900px] top-[-300px] left-[-250px] bg-[radial-gradient(circle,rgba(2,80,160,0.13)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed w-[600px] h-[600px] bottom-[-200px] right-[-100px] bg-[radial-gradient(circle,rgba(79,195,247,0.07)_0%,transparent_70%)] rounded-full pointer-events-none z-0 blur-[20px]" />
      <div className="fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(79,195,247,0.012)_2px,rgba(79,195,247,0.012)_4px)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[rgba(4,12,28,0.92)] border border-[rgba(79,195,247,0.2)] mb-6 relative overflow-hidden animate-[fade-in-up_0.4s_ease_both]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[rgba(79,195,247,0.4)] flex items-center justify-center font-['Cinzel',serif] text-sm font-bold text-[#4fc3f7] relative">
              S
              <div className="absolute inset-[-4px] border border-[rgba(79,195,247,0.13)]" />
            </div>
            <span className="font-['Cinzel',serif] text-base font-bold tracking-[3px] text-[#e0f7fa]">THE SYSTEM</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.35)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fe6a0] animate-[dot-pulse_2s_ease-in-out_infinite]" />
              Command Active
            </div>
            <div className="font-['Cinzel',serif] text-[11px] font-bold tracking-[3px] text-[#ffd54f] border border-[rgba(255,213,79,0.35)] px-3 py-0.5">
              OPERATIONS CALENDAR
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6 px-0.5 animate-[fade-in-up_0.4s_0.06s_ease_both]">
          <div className="font-['Cinzel',serif] text-3xl font-black tracking-[3px] bg-gradient-to-r from-[#e0f7fa] to-[#4fc3f7] bg-clip-text text-transparent">
            MISSION TIMELINE
          </div>
          <div className="text-[11px] tracking-[3px] uppercase text-[rgba(79,195,247,0.32)] mt-1">
            Gate Operations Schedule · Hunter Deployment Calendar
          </div>
          <div className="h-px mt-3 bg-gradient-to-r from-[#4fc3f7] via-[rgba(79,195,247,0.1)] to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.4s_0.12s_ease_both]">
              {/* Calendar Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(79,195,247,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                  <span className="font-['Cinzel',serif] text-sm font-bold tracking-[2px] text-[#e0f7fa]">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-1.5 hover:bg-[rgba(79,195,247,0.1)] transition-colors"
                  >
                    <ChevronLeft size={16} className="text-[rgba(79,195,247,0.5)]" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-[10px] tracking-[2px] uppercase border border-[rgba(79,195,247,0.2)] hover:border-[rgba(79,195,247,0.5)] transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-1.5 hover:bg-[rgba(79,195,247,0.1)] transition-colors"
                  >
                    <ChevronRight size={16} className="text-[rgba(79,195,247,0.5)]" />
                  </button>
                </div>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 border-b border-[rgba(79,195,247,0.1)]">
                {weekDays.map(day => (
                  <div key={day} className="py-2 text-center">
                    <span className="text-[10px] tracking-[2px] font-semibold text-[rgba(79,195,247,0.45)]">{day}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 auto-rows-fr">
                {days.map((day, idx) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const dayKey = toDateKey(day);
                  const isToday = dayKey === todayStr;
                  const isDropTarget = dayKey === dropTargetDate;
                  const dayEvents = getEventsForDate(day);
                  const dayTasks = getTasksForDate(day);
                  const dayStr = day.getDate();
                  
                  return (
                    <div
                      key={idx}
                      className={`min-h-[100px] p-1.5 border-r border-b border-[rgba(79,195,247,0.05)] transition-all duration-200 hover:bg-[rgba(79,195,247,0.03)] ${
                        !isCurrentMonth ? "opacity-40" : ""
                      } ${isToday ? "bg-[rgba(79,195,247,0.05)]" : ""} ${isDropTarget ? "ring-1 ring-[#4fc3f7] bg-[rgba(79,195,247,0.1)]" : ""}`}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        setDropTargetDate(dayKey);
                      }}
                      onDragLeave={() => {
                        if (dropTargetDate === dayKey) {
                          setDropTargetDate(null);
                        }
                      }}
                      onDrop={(event) => {
                        void scheduleTaskOnDate(dayKey, event);
                      }}
                      onClick={() => {
                        setNewEvent({ ...newEvent, date: dayKey });
                        setShowAddModal(true);
                      }}
                    >
                      <div className={`text-[11px] font-semibold mb-1 ${
                        isToday ? "text-[#4fc3f7]" : "text-[rgba(79,195,247,0.6)]"
                      }`}>
                        {dayStr}
                      </div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 1).map(task => (
                          <div
                            key={`task-${task.id}`}
                            draggable
                            onDragStart={(event) => startTaskDrag(task.id, event)}
                            onDragEnd={() => {
                              setDragTaskId(null);
                              setDropTargetDate(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[9px] tracking-[1px] px-1.5 py-0.5 truncate border cursor-grab active:cursor-grabbing transition-all hover:scale-105 border-[#4fc3f7]/50 bg-[#4fc3f7]/10 text-[#9fe8ff]"
                            title="Drag to another day"
                          >
                            ◈ {task.title}
                          </div>
                        ))}
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                            className={`text-[9px] tracking-[1px] px-1.5 py-0.5 truncate border cursor-pointer transition-all hover:scale-105 ${getEventTypeStyle(event.type || "meeting")}`}
                          >
                            {event.time && <span className="opacity-60">{event.time.slice(0,5)} </span>}
                            {event.title}
                          </div>
                        ))}
                        {(dayEvents.length > 2 || dayTasks.length > 1) && (
                          <div className="text-[8px] text-[rgba(79,195,247,0.4)] pl-1.5">
                            +{Math.max(dayEvents.length - 2, 0) + Math.max(dayTasks.length - 1, 0)} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 px-5 py-3 border-t border-[rgba(79,195,247,0.1)] text-[9px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-[rgba(79,195,247,0.5)]">Mission</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-[rgba(79,195,247,0.5)]">Meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[rgba(79,195,247,0.5)]">Deadline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[rgba(79,195,247,0.5)]">Training</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Events & Actions */}
          <div className="space-y-5">
            {/* Add Event Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[11px] tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all duration-300 group animate-[fade-in-up_0.4s_0.18s_ease_both]"
            >
              <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
              SCHEDULE OPERATION
            </button>

            {/* Search & Filters */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 animate-[fade-in-up_0.4s_0.24s_ease_both]">
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(79,195,247,0.35)]" />
                <input
                  type="text"
                  placeholder="Search operations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[rgba(4,18,38,0.6)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-xs"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex-1 px-2 py-1.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] text-[10px] tracking-[1px] text-[#e0f7fa] focus:outline-none"
                >
                  <option value="all">ALL TYPES</option>
                  <option value="mission">MISSION</option>
                  <option value="meeting">MEETING</option>
                  <option value="deadline">DEADLINE</option>
                  <option value="training">TRAINING</option>
                </select>
                <button className="px-3 py-1.5 border border-[rgba(79,195,247,0.2)] text-[10px] tracking-[1px] hover:border-[rgba(79,195,247,0.5)] transition-colors">
                  <RefreshCw size={12} />
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.4s_0.3s_ease_both]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(79,195,247,0.1)]">
                <div className="w-1 h-4 bg-[#ffd54f] shadow-[0_0_6px_#ffd54f]" />
                <span className="font-['Cinzel',serif] text-xs font-bold tracking-[2px] text-[#e0f7fa]">UPCOMING OPERATIONS</span>
                <span className="text-[9px] tracking-[2px] bg-[rgba(79,195,247,0.07)] border border-[rgba(79,195,247,0.2)] px-1.5 py-0.5 text-[rgba(79,195,247,0.55)] ml-auto">
                  {upcomingEvents.length}
                </span>
              </div>
              <div className="max-h-100 overflow-y-auto">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, idx) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`p-3 border-b border-[rgba(79,195,247,0.07)] hover:bg-[rgba(79,195,247,0.04)] transition-all duration-200 cursor-pointer group ${event.completed ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[8px] font-bold tracking-[1px] uppercase px-1.5 py-0.5 border ${getEventTypeStyle(event.type || "meeting")}`}>
                              {event.type?.toUpperCase() || "EVENT"}
                            </span>
                            <span className={`text-[9px] ${getPriorityStyle(event.priority || "medium")}`}>
                              {event.priority?.toUpperCase()}
                            </span>
                            {event.completed && (
                              <CheckCircle2 size={10} className="text-emerald-400" />
                            )}
                          </div>
                          <p className="text-sm font-medium text-[#e0f7fa] group-hover:text-[#4fc3f7] transition-colors">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[rgba(79,195,247,0.4)]">
                            <div className="flex items-center gap-1">
                              <Calendar size={10} />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-1">
                                <Clock size={10} />
                                <span>{event.time}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin size={10} />
                                <span className="truncate max-w-[100px]">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(event.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[rgba(79,195,247,0.1)] rounded"
                        >
                          <CheckCircle2 size={14} className="text-[rgba(79,195,247,0.5)]" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-3xl opacity-20 mb-2">📅</div>
                    <p className="text-[10px] tracking-[2px] text-[rgba(79,195,247,0.3)]">No upcoming operations</p>
                  </div>
                )}
              </div>
            </div>

            {/* Task Drag Pool */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] overflow-hidden animate-[fade-in-up_0.4s_0.34s_ease_both]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(79,195,247,0.1)]">
                <div className="w-1 h-4 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                <span className="font-['Cinzel',serif] text-xs font-bold tracking-[2px] text-[#e0f7fa]">TASK SCHEDULER</span>
                <span className="text-[9px] tracking-[2px] bg-[rgba(79,195,247,0.07)] border border-[rgba(79,195,247,0.2)] px-1.5 py-0.5 text-[rgba(79,195,247,0.55)] ml-auto">
                  {unscheduledTasks.length}
                </span>
              </div>
              <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
                {unscheduledTasks.length > 0 ? (
                  unscheduledTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(event) => startTaskDrag(task.id, event)}
                      onDragEnd={() => {
                        setDragTaskId(null);
                        setDropTargetDate(null);
                      }}
                      className="text-[10px] px-2 py-1.5 border border-[#4fc3f7]/40 bg-[#4fc3f7]/8 text-[#b8efff] cursor-grab active:cursor-grabbing hover:bg-[#4fc3f7]/14 transition-all"
                      title="Drag onto a day in the calendar"
                    >
                      {task.title}
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] tracking-[1.5px] text-[rgba(79,195,247,0.35)] text-center py-2">
                    All tasks already scheduled
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[rgba(4,18,38,0.95)] border border-[rgba(79,195,247,0.2)] p-4 animate-[fade-in-up_0.4s_0.36s_ease_both]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-[#4fe6a0] shadow-[0_0_6px_#4fe6a0]" />
                <span className="font-['Cinzel',serif] text-xs font-bold tracking-[2px] text-[#e0f7fa]">OPERATION METRICS</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 border border-[rgba(79,195,247,0.1)]">
                  <p className="text-xl font-['Cinzel',serif] font-bold text-[#4fc3f7]">{events.length}</p>
                  <p className="text-[8px] tracking-[1px] text-[rgba(79,195,247,0.4)]">TOTAL</p>
                </div>
                <div className="text-center p-2 border border-[rgba(79,195,247,0.1)]">
                  <p className="text-xl font-['Cinzel',serif] font-bold text-[#ff6b6b]">{events.filter(e => e.priority === "high").length}</p>
                  <p className="text-[8px] tracking-[1px] text-[rgba(79,195,247,0.4)]">CRITICAL</p>
                </div>
                <div className="text-center p-2 border border-[rgba(79,195,247,0.1)]">
                  <p className="text-xl font-['Cinzel',serif] font-bold text-[#4fe6a0]">{events.filter(e => e.type === "mission").length}</p>
                  <p className="text-[8px] tracking-[1px] text-[rgba(79,195,247,0.4)]">MISSIONS</p>
                </div>
                <div className="text-center p-2 border border-[rgba(79,195,247,0.1)]">
                  <p className="text-xl font-['Cinzel',serif] font-bold text-[#ffd54f]">{events.filter(e => !e.completed && e.date >= todayStr).length}</p>
                  <p className="text-[8px] tracking-[1px] text-[rgba(79,195,247,0.4)]">PENDING</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-5 px-4 py-2 bg-[rgba(4,12,28,0.85)] border border-[rgba(79,195,247,0.1)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.25)] animate-[fade-in-up_0.4s_0.42s_ease_both]">
          <span>Operations Calendar v1.0 · Real-time Schedule</span>
          <span className="text-[rgba(79,230,160,0.5)]">⬡ Timeline Active</span>
          <span>Last Sync: Just Now</span>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] w-full max-w-md p-6 shadow-2xl animate-[fade-in-up_0.3s_ease]">
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[rgba(79,195,247,0.3)]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[rgba(79,195,247,0.3)]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[rgba(79,195,247,0.3)]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[rgba(79,195,247,0.3)]" />
            
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                <h3 className="font-['Cinzel',serif] text-lg font-bold tracking-[2px] text-[#e0f7fa]">SCHEDULE OPERATION</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-[rgba(79,195,247,0.1)] transition-colors">
                <X size={18} className="text-[rgba(79,195,247,0.5)]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">OPERATION NAME *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g., Abyssal Gate Recon"
                  className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">DATE *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">TIME</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">TYPE</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                  >
                    <option value="mission">MISSION</option>
                    <option value="meeting">MEETING</option>
                    <option value="deadline">DEADLINE</option>
                    <option value="training">TRAINING</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">PRIORITY</label>
                  <select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                  >
                    <option value="high">HIGH / S-RANK</option>
                    <option value="medium">MEDIUM / A-RANK</option>
                    <option value="low">LOW / B-RANK</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">LOCATION</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="e.g., Command Center, Sector 7"
                  className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.45)] mb-2">DESCRIPTION</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={2}
                  placeholder="Additional details..."
                  className="w-full px-4 py-2.5 bg-[rgba(4,18,38,0.8)] border border-[rgba(79,195,247,0.2)] focus:border-[rgba(79,195,247,0.5)] focus:outline-none text-[#e0f7fa] text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 border border-[rgba(79,195,247,0.2)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 px-4 py-2.5 bg-[rgba(79,195,247,0.1)] border border-[#4fc3f7] text-[10px] tracking-[2px] uppercase text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
          <div className="relative bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] w-full max-w-md p-6 shadow-2xl animate-[fade-in-up_0.3s_ease]">
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[rgba(79,195,247,0.3)]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[rgba(79,195,247,0.3)]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[rgba(79,195,247,0.3)]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[rgba(79,195,247,0.3)]" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-1 h-5 ${selectedEvent.type === "mission" ? "bg-red-400" : selectedEvent.type === "meeting" ? "bg-sky-400" : selectedEvent.type === "deadline" ? "bg-amber-400" : "bg-emerald-400"} shadow-[0_0_6px_currentColor]`} />
                <h3 className="font-['Cinzel',serif] text-lg font-bold tracking-[2px] text-[#e0f7fa]">{selectedEvent.title}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="p-1.5 hover:bg-[rgba(255,100,100,0.1)] transition-colors"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
                <button onClick={() => setSelectedEvent(null)} className="p-1.5 hover:bg-[rgba(79,195,247,0.1)] transition-colors">
                  <X size={14} className="text-[rgba(79,195,247,0.5)]" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 text-sm text-[rgba(79,195,247,0.6)]">
                <Calendar size={14} />
                <span>{new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {selectedEvent.time && (
                <div className="flex items-center gap-3 text-sm text-[rgba(79,195,247,0.6)]">
                  <Clock size={14} />
                  <span>{selectedEvent.time}</span>
                </div>
              )}
              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-sm text-[rgba(79,195,247,0.6)]">
                  <MapPin size={14} />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              {selectedEvent.description && (
                <div className="pt-2 border-t border-[rgba(79,195,247,0.1)]">
                  <p className="text-xs text-[rgba(79,195,247,0.5)] leading-relaxed">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-3 border-t border-[rgba(79,195,247,0.1)]">
              <button
                onClick={() => handleToggleComplete(selectedEvent.id)}
                className={`flex-1 px-4 py-2 text-[10px] tracking-[2px] uppercase transition-all ${
                  selectedEvent.completed
                    ? "border border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                    : "border border-[rgba(79,195,247,0.2)] text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)]"
                }`}
              >
                {selectedEvent.completed ? "COMPLETED ✓" : "MARK COMPLETE"}
              </button>
              <button className="px-4 py-2 border border-[rgba(79,195,247,0.2)] text-[10px] tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] hover:border-[rgba(79,195,247,0.5)] transition-all">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px #4fe6a0; }
          50% { opacity: 0.4; box-shadow: none; }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.2); }
      `}</style>
    </div>
  );
}