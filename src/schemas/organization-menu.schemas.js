import z from "zod";

export const addOrganizationCategorySchema = z.object({
  organizationId: z.string(),
  categoryName: z.string(),
  orderNumber: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateOrganizationCategorySchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  categoryName: z.string().optional(),
  orderNumber: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const organizationSearchMenuSchema = z.object({
  organizationId: z.string(),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});

export const organizationAddonItemSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(0).default(0),
  isAvailable: z.boolean().default(true),
});

export const organizationAddonGroupSchema = z
  .object({
    name: z.string().min(1),
    isRequired: z.boolean().default(false),
    maxSelection: z.coerce.number().min(0).default(0),
    items: z.array(organizationAddonItemSchema).min(1),
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
    }
  );

export const organizationAddAddonGroupSchema = z.object({
  organizationMenuId: z.string(),
  name: z.string(),
  isRequired: z.boolean().default(false),
  maxSelection: z.number().default(0),
});

export const organizationUpdateAddonGroupSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  isRequired: z.boolean().optional(),
  maxSelection: z.number().optional(),
});

export const organizationAddAddonSchema = z.object({
  organizationAddonGroupId: z.string(),
  name: z.string(),
  price: z.number().min(0),
  isAvailable: z.boolean().default(true),
});

export const organizationUpdateAddonSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  price: z.number().optional(),
  isAvailable: z.boolean().optional(),
});

export const organizationAddMenuSchema = z.object({
  organizationCategoryId: z.string(),
  organizationId: z.string(),
  name: z.string(),
  description: z.string().min(5),
  imagePath: z.string(),
  price: z.coerce.number().min(0),
  discount: z.coerce.number().max(100).default(0),
  isAvailable: z.coerce.boolean().default(true),
  isActive: z.coerce.boolean().default(true),
});

export const organizationUpdateMenuSchema = z.object({
  id: z.string(),
  organizationCategoryId: z.string().optional(),
  name: z.string().optional(),
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
