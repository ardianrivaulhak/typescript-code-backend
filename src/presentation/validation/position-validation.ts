import { z } from "zod";

export const PositionScheme = z.object({
  name: z.string().min(1),
});
