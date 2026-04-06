import { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Calendar, User, Clock, Briefcase } from "lucide-react";
import type { Task, TaskStatus } from "../../../store/taskStore";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => Promise<boolean>;
    task?: Task;
  status?: TaskStatus;
  projects?: Array<{ id: number; name: string }>; // optional project list
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  task,
  status = "todo",
  projects = [],
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(task?.status || status);
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState<number | "">("");
  const [assignedTo, setAssignedTo] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setTaskStatus(task?.status || status);
    setPriority(task?.priority || "medium");
    setDueDate(task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    setProjectId(task?.projectId || "");
    setAssignedTo(task?.assignee?.id?.toString() || "");
    setEstimatedHours(task?.estimatedHours?.toString() || "");
  }, [task, status, isOpen]);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) return;
  
    const result = await onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status: taskStatus,
      priority,
      dueDate: dueDate || undefined,
      projectId: projectId || undefined,
      assignee: assignedTo
  ? assignedTo.split(",").map(id => ({
      id: Number(id),
      name: "",   // you must fill this
      email: ""
    }))[0] 
  : undefined,
      estimatedHours: estimatedHours ? parseInt(estimatedHours) : undefined,
    });
  
    if (result) {
      onClose();
    }
  }, [
    title, description, taskStatus, priority,
    dueDate, projectId, assignedTo, estimatedHours,
    onSave, onClose
  ]);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Darker, blurred overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-lg bg-[rgba(4,18,38,0.98)] border border-[rgba(79,195,247,0.3)] shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm rounded-none">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[rgba(79,195,247,0.4)]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[rgba(79,195,247,0.4)]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[rgba(79,195,247,0.4)]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[rgba(79,195,247,0.4)]" />

              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[rgba(79,195,247,0.15)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
                  <Dialog.Title className="font-[Cinzel,serif] text-lg tracking-wider text-[#e0f7fa]">
                    {task ? "EDIT QUEST" : "NEW QUEST"}
                  </Dialog.Title>
                </div>
                <button
                  onClick={onClose}
                  className="text-[rgba(79,195,247,0.5)] hover:text-[#4fc3f7] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] mb-2">
                    QUEST TITLE
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(79,195,247,0.2)] p-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[rgba(79,195,247,0.6)] transition-colors"
                    placeholder="Enter quest name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] mb-2">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(79,195,247,0.2)] p-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[rgba(79,195,247,0.6)] transition-colors resize-none"
                    placeholder="Quest details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Two column grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] mb-2">
                      STATUS
                    </label>
                    <select
                      className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(79,195,247,0.2)] p-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[rgba(79,195,247,0.6)]"
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                    >
                      <option value="todo">Standby</option>
                      <option value="inprogress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] mb-2">
                      PRIORITY
                    </label>
                    <select
                      className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(79,195,247,0.2)] p-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[rgba(79,195,247,0.6)]"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                    >
                      <option value="low">C-Rank</option>
                      <option value="medium">B-Rank</option>
                      <option value="high">A-Rank</option>
                      <option value="urgent">S-Rank</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] mb-2">
                      <Calendar size={10} className="inline mr-1" /> DUE DATE
                    </label>
                    <input
                      type="date"
                      className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(79,195,247,0.2)] p-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[rgba(79,195,247,0.6)]"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  {/* Estimated Hours */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] mb-2">
                      <Clock size={10} className="inline mr-1" /> EST. HOURS
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(79,195,247,0.2)] p-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[rgba(79,195,247,0.6)]"
                      placeholder="Hours"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                    />
                  </div>
                </div>

                {/* Project */}
                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] mb-2">
                    <Briefcase size={10} className="inline mr-1" /> GATE (PROJECT)
                  </label>
                  <select
                    className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(79,195,247,0.2)] p-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[rgba(79,195,247,0.6)]"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : "")}
                  >
                    <option value="">None</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned To */}
                <div>
                  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[rgba(79,195,247,0.5)] mb-2">
                    <User size={10} className="inline mr-1" /> ASSIGNED HUNTERS
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(79,195,247,0.2)] p-2 text-[#e0f7fa] text-sm focus:outline-none focus:border-[rgba(79,195,247,0.6)]"
                    placeholder="Hunter names (comma separated)"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 p-5 border-t border-[rgba(79,195,247,0.15)]">
                <button
                  className="px-5 py-1.5 text-xs font-semibold tracking-wider text-[rgba(79,195,247,0.7)] border border-[rgba(79,195,247,0.3)] hover:bg-[rgba(79,195,247,0.05)] transition-all"
                  onClick={onClose}
                >
                  CANCEL
                </button>
                <button
                  className="px-5 py-1.5 text-xs font-semibold tracking-wider text-[#0a1929] bg-[#4fc3f7] border border-[#4fc3f7] shadow-[0_0_8px_rgba(79,195,247,0.5)] hover:bg-[#3ba8db] transition-all active:scale-[0.98]"
                  onClick={handleSubmit}
                >
                  {task ? "UPDATE QUEST" : "CREATE QUEST"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}