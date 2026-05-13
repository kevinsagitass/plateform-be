import { z } from "zod";

export const registerUserSchema = z
  .object({
    username: z.string().min(5, "Username minimal 5 karakter"),
    name: z.string().min(3),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

export const searchMenuSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});

export const addMenuSchema = z.object({
  categoryId: z.string(),
  name: z.string(),
  description: z.string().min(5),
  imagePath: z.string(),
  price: z.coerce.number(),
  discount: z.coerce.number().max(100).default(0),
  isAvailable: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const updateMenuSchema = z.object({
  id: z.string(),
  description: z.string().min(5).optional(),
  newImagePath: z.string().optional(),
  price: z.coerce.number().optional(),
  discount: z.coerce.number().max(100).optional(),
  isAvailable: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      const lower = val.toLowerCase();
      return lower === "true" || lower === "1";
    })
    .optional(),
  isActive: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      const lower = val.toLowerCase();
      return lower === "true" || lower === "1";
    })
    .optional(),
});
