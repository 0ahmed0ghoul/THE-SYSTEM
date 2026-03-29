export type Status = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: Status;
  position: number; // for ordering in column
  projectId: number; // associate with project
  priority: "low" | "medium" | "high";
}