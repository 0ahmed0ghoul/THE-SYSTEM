export type Status = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: Status;
}