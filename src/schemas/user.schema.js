import z from "zod";

export const registerUserSchema = z
  .object({
    username: z.string().min(5, "Username minimal 5 karakter"),
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });
