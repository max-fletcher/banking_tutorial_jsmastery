import { z } from "zod"

// NOTE: We are exporting a function here instead of an object so we can accept a type and use conditionals. We can still get an object out of it by calling this function though.
export const authFormSchema = (type: string) => z.object({
  // Sign Up
  firstName: type === "sign-in" ? z.string().optional() : z.string().min(3),
  lastName: type === "sign-in" ? z.string().optional() : z.string().min(3),
  address1: type === "sign-in" ? z.string().optional() : z.string().max(50),
  city: type === "sign-in" ? z.string().optional() : z.string().max(50),
  state: type === "sign-in" ? z.string().optional() : z.string().min(2).max(2),
  postalCode: type === "sign-in" ? z.string().optional() : z.string().min(5),
  dateOfBirth: type === "sign-in" ? z.string().optional() : z.string().min(3),
  ssn: type === "sign-in" ? z.string().optional() : z.string().min(3),
  // Both Sign In & Sign Up
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})