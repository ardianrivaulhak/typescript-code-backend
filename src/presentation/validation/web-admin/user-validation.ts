import { z } from "zod";

export const webadminLoginScheme = z.object({
  email: z.string(),
  password: z.string(),
});

export const hmiLoginScheme = z.object({
  email: z.string(),
  password: z.string(),
  machineId: z.string(),
  shiftId: z.string(),
});
