import { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Task, TaskPriority, TaskStatus } from "../../../store/taskStore";
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => boolean | void;
  task?: Task;
  status?: TaskStatus; // ✅ use TaskStatus, not Status
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  task,
  status = "todo", // ✅ default here
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  // ✅ Sync state properly when modal opens
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(
    task?.status || status || "todo"
  );
  
  useEffect(() => {
    if (!isOpen) return;
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setTaskStatus(task?.status || status || "todo"); // ✅ now types match
    setPriority(task?.priority || "medium");
  }, [task, status, isOpen]);

  // ✅ Safe submit (respects onSave return)
  const handleSubmit = useCallback(() => {
    if (!title.trim()) return;

    const result = onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status: taskStatus,
      priority,
    });

    // ❗ Only close if not explicitly prevented
    if (result !== false) {
      onClose();
    }
  }, [title, description, taskStatus, priority, onSave, onClose]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal */}
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
            <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              {/* Title */}
              <Dialog.Title className="text-lg font-bold mb-4">
                {task ? "Edit Task" : "New Task"}
              </Dialog.Title>

              {/* Title Input */}
              <input
                className="w-full border border-gray-200 p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Description */}
              <textarea
                className="w-full border border-gray-200 p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Status */}
              <select
                className="w-full border border-gray-200 p-2 mb-3 rounded-lg"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
              >
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>

              {/* Priority */}
              <select
                className="w-full border border-gray-200 p-2 mb-3 rounded-lg"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskPriority)
                }
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>

              {/* Actions */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition active:scale-[0.98]"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}