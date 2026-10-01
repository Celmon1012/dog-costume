import { z } from "zod";

export const dogRegistrationSchema = z.object({
  dogName: z.string().min(1, "Dog name is required").max(100),
  ownerName: z.string().min(1, "Owner name is required").max(100),
  ownerEmail: z.string().email("Valid email required"),
  ownerPhone: z
    .string()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long"),
  breed: z.string().max(80),
  costumeDescription: z
    .string()
    .min(3, "What are they dressed as?")
    .max(500, "Keep this under 500 characters"),
  inspiration: z.string().max(500),
  funnyFact: z.string().max(500),
});

export type DogRegistrationInput = z.infer<typeof dogRegistrationSchema>;

export const dogUpdateSchema = dogRegistrationSchema.extend({
  id: z.string().min(1),
  isFinalist: z.boolean().optional(),
});

export type DogUpdateInput = z.infer<typeof dogUpdateSchema>;
