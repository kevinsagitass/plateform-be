import z from "zod";

export const inviteOrganizationMemberSchema = z.object({
  organizationId: z.string(),
  email: z.email(),
  role: z.enum(["ADMIN"]),
});

export const removeOrganizationUserAccessSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.enum(["ADMIN"]),
});

export const updateTenantUserAccessSchema = z.object({
  organizationId: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  oldRole: z.enum(["STORE_MANAGER", "CASHIER", "COOK"]),
  newRole: z.enum(["STORE_MANAGER", "CASHIER", "COOK"]),
});

export const removeTenantUserAccessSchema = z.object({
  organizationId: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  role: z.enum(["CASHIER", "COOK"]),
});
