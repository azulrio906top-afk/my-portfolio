import { z } from "zod";

export const chatRequestSchema =
  z.object({
    message: z
      .string()
      .trim()
      .min(1)
      .max(2000),

    history: z
      .array(
        z.object({
          role: z.enum([
            "user",
            "assistant",
          ]),

          content: z
            .string()
            .max(4000),
        }),
      )
      .max(20)
      .default([]),
  });