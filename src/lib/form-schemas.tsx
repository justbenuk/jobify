import * as z from "zod";

export const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least two charictors",
  }),
});
