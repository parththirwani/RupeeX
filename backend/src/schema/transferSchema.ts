import {z} from "zod"

export const transferSchema = z.object({
    amount: z.number().min(1, { message: "Value must be at least 1" })
})
