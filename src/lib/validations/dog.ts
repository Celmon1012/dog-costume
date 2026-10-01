import { z } from "zod";

export const dogRegistrationSchema = z.object({
  dogName: z.string().min(1, "Dog name is required").max(100),
  ownerName: z.string().min(1, "Owner name is required").max(100),
  ownerEmail: z.string().email("Valid email required"),
  ownerPhone: z
    .string()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long"),
  costumeDescription: z
    .string()
    .min(3, "Describe the costume")
    .max(500, "Keep description under 500 characters"),
});

export type DogRegistrationInput = z.infer<typeof dogRegistrationSchema>;

export const dogUpdateSchema = dogRegistrationSchema.extend({
  id: z.string().min(1),
  isFinalist: z.boolean().optional(),
});

export type DogUpdateInput = z.infer<typeof dogUpdateSchema>;
