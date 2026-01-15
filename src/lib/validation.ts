import { z } from 'zod';

export const personalSchema = z.object({
  name: z.string().min(1),
  age: z.string().min(1),
  education: z.string().min(1),
  employment: z.string().min(1),
  location: z.string().min(1)
});

export const learningSchema = z.object({
  motivation: z.string().min(1),
  experience: z.string().min(1),
  time: z.string().min(1),
  preferences: z.string().min(1)
});

export const interestsSchema = z.object({
  interests: z.array(z.string()).min(1)
});
