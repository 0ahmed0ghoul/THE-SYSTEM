// backend/src/validators/project.validators.ts
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  description: z.string().trim().max(5000).optional().default(""),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['planning', 'active', 'onHold', 'completed', 'archived']).default('planning'),
  progress: z.number().min(0).max(100).default(0),
  visibility: z.enum(['private', 'public']).default('private'),
  requiresApproval: z.boolean().default(false),
});

export const projectIdParamSchema = z.object({
  id: z.string().transform(Number),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(5000).optional(),
});