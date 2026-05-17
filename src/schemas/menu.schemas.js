import z from "zod";

export const searchMenuSchema = z.object({
  tenantId: z.string(),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});

export const addonItemSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(0).default(0),
  isAvailable: z.boolean().default(true),
});

export const addonGroupSchema = z
  .object({
    name: z.string().min(1),
    isRequired: z.boolean().default(false),
    maxSelection: z.coerce.number().min(0).default(0),
    items: z.array(addonItemSchema).min(1),
  })
  .refine(
    (data) => {
      if (data.isRequired) {
        return data.maxSelection > 0;
      }

      return true;
    },
    {
      message: "maxSelection must be greater than 0 when addon is required",
      path: ["maxSelection"],
    },
  );

export const addMenuSchema = z.object({
  categoryId: z.string(),
  tenantId: z.string(),
  name: z.string(),
  description: z.string().min(5),
  imagePath: z.string(),
  price: z.coerce.number(),
  discount: z.coerce.number().max(100).default(0),
  isAvailable: z.boolean().default(true),
  isActive: z.boolean().default(true),
  addons: z.array(addonGroupSchema).default([]),
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
  addons: z.array(addonGroupSchema).optional(),
});
