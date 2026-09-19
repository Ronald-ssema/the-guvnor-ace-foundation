import { z } from "zod";

export const MAX_CHAT_MESSAGES = 10;
export const MAX_CHAT_MESSAGE_LENGTH = 1_200;
export const MAX_CHAT_TOTAL_LENGTH = 6_000;

export const chatRequestSchema = z
  .object({
    messages: z
      .array(
        z
          .object({
            role: z.enum(["user", "assistant"]),
            content: z.string().trim().min(1).max(MAX_CHAT_MESSAGE_LENGTH),
          })
          .strict(),
      )
      .min(1)
      .max(MAX_CHAT_MESSAGES),
  })
  .strict()
  .superRefine(({ messages }, context) => {
    const totalLength = messages.reduce(
      (total, message) => total + message.content.length,
      0,
    );

    if (totalLength > MAX_CHAT_TOTAL_LENGTH) {
      context.addIssue({
        code: "custom",
        message: "The conversation is too long.",
      });
    }

    if (messages.at(-1)?.role !== "user") {
      context.addIssue({
        code: "custom",
        message: "The final message must be from the user.",
      });
    }

    messages.forEach((message, index) => {
      if (index > 0 && messages[index - 1]?.role === message.role) {
        context.addIssue({
          code: "custom",
          message: "Message roles must alternate.",
          path: ["messages", index, "role"],
        });
      }
    });
  });
