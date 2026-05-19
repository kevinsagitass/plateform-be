import z from "zod";

export const addOrganizationSchema = z.object({
  name: z.string().min(3),
});

export const updateOrganizationSchema = z.object({
  organizationId: z.string(),
  name: z.string().optional(),
  subscription: z
    .object({
      subscriptionId: z.string().optional(),
      plan: z.enum(["FREE", "BASIC", "PRO"]).optional(),
      status: z.enum(["ACTIVE", "EXPIRED", "CANCELED"]).optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .optional(),
});
