import { z } from "zod";

export const DepectsCreateScheme = z.object({
  name: z.string(),
});

export const DepectsUpdateScheme = z.object({
  name: z.string(),
});
