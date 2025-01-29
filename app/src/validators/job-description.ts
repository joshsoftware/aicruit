import { ValidationMessage } from "@/constants/messages";
import { z } from "zod";

const MAX_FILE_SIZE_MB = 10;

export const jobDescriptionSchema = z
  .object({
    title: z.string().min(2, {
      message: ValidationMessage.NAME_MIN_LENGTH,
    }),
    file: z
      .any()
      .optional()
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
        `File size must be less than ${MAX_FILE_SIZE_MB} MB`
      ),
    link: z.string().url("Invalid URL").optional(),
  })
  .refine(
    (data) => !!data.file || !!data.link,
    "Please provide either a file or a link."
  )
  .refine(
    (data) => !(data.file && data.link),
    "You can upload either a file or a link, not both."
  );

export type createJobDescriptionRequest = z.infer<typeof jobDescriptionSchema>;
