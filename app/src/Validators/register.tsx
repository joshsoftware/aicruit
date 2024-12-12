import { z } from "zod";

export const signupUserSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name should be at least 2 characters long"
    }),
    officeEmail: z.string().email({
      message: "Invalid email"
    }),
    mobile: z.string().regex(/^\d{10}$/, {
      message: "Contact number must be exactly 10 digits"
    }),
    designation: z.string().min(2, {
      message: "Designation should be at least 2 characters long"
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long"
      })
      .max(16, {
        message: "Password must be at most 16 characters long"
      }),
    confirmPassword: z.string({
      message: "Confirm Password is required"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

export const signinUserSchema = z.object({
  officeEmail: z.string().email({
    message: "Invalid email"
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long"
    })
    .max(16, {
      message: "Password must be at most 16 characters long"
    })
});

export type SignupUserRequest = z.infer<typeof signupUserSchema>;
export type SigninUserRequest = z.infer<typeof signinUserSchema>;
