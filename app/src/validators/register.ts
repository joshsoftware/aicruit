import { z } from "zod";
import { ValidationMessage } from "../constants/messages";

export const signupUserSchema = z.object({
  firstName: z.string().min(2, {
    message: ValidationMessage.NAME_MIN_LENGTH,
  }),
  lastName: z.string().min(2, {
    message: ValidationMessage.NAME_MIN_LENGTH,
  }),
  email: z.string().email({
    message: ValidationMessage.INVALID_EMAIL,
  }),
  password: z
    .string()
    .min(8, {
      message: ValidationMessage.PASSWORD_MIN_LENGTH,
    })
    .max(16, {
      message: ValidationMessage.PASSWORD_MAX_LENGTH,
    }),
});

export const signinUserSchema = z.object({
  email: z.string().email({
    message: ValidationMessage.INVALID_EMAIL,
  }),
  password: z
    .string()
    .min(8, {
      message: ValidationMessage.PASSWORD_MIN_LENGTH,
    })
    .max(16, {
      message: ValidationMessage.PASSWORD_MAX_LENGTH,
    }),
});

export type SignupUserRequest = z.infer<typeof signupUserSchema>;
export type SigninUserRequest = z.infer<typeof signinUserSchema>;
