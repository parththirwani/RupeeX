import { z } from "zod"
import validator from "validator";

export const userSchema = z.object({
    phone: z.string().min(10,{message: "Not a valid phone number"}).max(10, { message: "Not a valid phone number"}),
    password: z.string()
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
        }),
    firstName: z.string().min(1,{message: "First Name is required"}),
    middleName: z.string().min(1,{message: "Name is required"}).optional(),
    lastName: z.string().min(1,{message: "Last Name is required"}),
})

export const signinSchema = z.object({
    phone: z.string().min(10,{message: "Not a valid phone number"}).max(10, { message: "Not a valid phone number"}),
    password: z.string()
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
})