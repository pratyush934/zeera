import { z } from "zod";

export const projectScehma = z.object({
  name: z
    .string()
    .min(1, "project name is required")
    .max(100, "max you can put 100 words"),
  key: z
    .string()
    .min(1, "key is required")
    .max(100, "max key length can be only 100"),

  description: z
            .string()
            .max(1000, "max 1000 can be accepted")
            .optional(),
});

export const issueSchema = z.object({
  title: z
    .string()
    .min(1, "Issue title is required")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assigneeId: z.string().optional(),
});


