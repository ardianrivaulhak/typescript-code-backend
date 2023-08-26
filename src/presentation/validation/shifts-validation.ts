import { z } from "zod";

export const ShiftsCreateScheme = z.object({
  name: z.string(),
});

export const ShiftsUpdateScheme = z.object({
  name: z.string(),
});
