import { z } from "zod";

export const taskStatusSchema = z.enum(["todo", "in-progress", "done"]);

export const listTasksQuerySchema = z.object({
  projectId: z.coerce.number().int().positive().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  projectId: z.coerce.number().int().positive(),
  assignedTo: z.coerce.number().int().positive().optional(),
  dueDate: z.string().date().optional(),
});

export const taskIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(255).optional(),
    status: taskStatusSchema.optional(),
    assignedTo: z.coerce.number().int().positive().nullable().optional(),
    dueDate: z.string().date().nullable().optional(),
    position: z.coerce.number().int().min(0).optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.status !== undefined ||
      value.assignedTo !== undefined ||
      value.dueDate !== undefined ||
      value.position !== undefined,
    {
      message: "At least one field is required",
    },
  );
