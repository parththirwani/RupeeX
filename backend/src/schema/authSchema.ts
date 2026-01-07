import { z } from "zod"

export const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(32, { message: "Password cannot be longer than 32 characters" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number",
  })
  .refine((password) => /[!@#$%^&*()]/.test(password), {
    message: "Password must contain at least one special character",
  })

export const phoneSchema = z.string()
  .min(10, { message: "Not a valid phone number" })
  .max(10, { message: "Not a valid phone number" })


export const userSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
  firstName: z.string().min(1, { message: "First Name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last Name is required" }),
})

export const signinSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
})

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  middleName: z.string().optional().nullable(),
  lastName: z.string().min(1).optional(),
})

export const updatePasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
}).refine(
  (data) => data.oldPassword !== data.newPassword,
  {
    message: "New password must be different from old password",
    path: ["newPassword"],
  }
)

