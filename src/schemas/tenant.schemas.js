import z from "zod";

export const addTenantSchema = z.object({
  organizationId: z.string(),
  tenantName: z.string().min(3),
  location: z.string().min(10),
  tenantWorkHours: z.array(
    z.object({
      dayOfMonth: z.int().min(0).max(6),
      openHour: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
          "Invalid time format (HH:MM or HH:MM:SS)"
        ),
      closeHour: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
          "Invalid time format (HH:MM or HH:MM:SS)"
        ),
    })
  ),
});

export const updateTenantSchema = z.object({
  tenantId: z.string(),
  tenantName: z.string().min(3).optional(),
  location: z.string().min(10).optional(),
  tenantWorkHours: z
    .array(
      z.object({
        tenantWorkHourId: z.string(),
        dayOfMonth: z.int().min(0).max(6).optional(),
        openHour: z
          .string()
          .regex(
            /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
            "Invalid time format (HH:MM or HH:MM:SS)"
          )
          .optional(),
        closeHour: z
          .string()
          .regex(
            /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
            "Invalid time format (HH:MM or HH:MM:SS)"
          )
          .optional(),
      })
    )
    .optional(),
});
