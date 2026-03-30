import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  description: z.string().trim().max(5000).optional().default(""),
});

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(160).optional(),
    description: z.string().trim().max(5000).optional(),
  })
  .refine(
    (value) => value.name !== undefined || value.description !== undefined,
    {
      message: "At least one field is required",
    },
  );

export const projectIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
