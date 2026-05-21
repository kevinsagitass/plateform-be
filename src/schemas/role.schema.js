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
