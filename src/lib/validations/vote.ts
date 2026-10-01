import { z } from "zod";

export const voteSubmissionSchema = z.object({
  votes: z
    .array(
      z.object({
        prizeCategoryId: z.string().min(1),
        dogId: z.string().min(1),
      }),
    )
    .min(1, "Select at least one dog"),
});

export type VoteSubmissionInput = z.infer<typeof voteSubmissionSchema>;
