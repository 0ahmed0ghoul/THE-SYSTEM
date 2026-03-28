import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Task, Status } from "../types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task; // undefined = new task
  status?: Status; // default status for new task
}

export default function TaskModal({ isOpen, onClose, onSave, task, status }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [taskStatus, setTaskStatus] = useState<Status>(task?.status || status || "todo");

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setTaskStatus(task?.status || status || "todo");
  }, [task, status]);

  const handleSubmit = () => {
    if (!title.trim()) return; // simple validation
    onSave({ title, description, status: taskStatus });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold mb-4">
                  {task ? "Edit Task" : "New Task"}
                </Dialog.Title>

                <input
                  className="w-full border p-2 mb-3 rounded"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="w-full border p-2 mb-3 rounded"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <select
                  className="w-full border p-2 mb-3 rounded"
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value as Status)}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}