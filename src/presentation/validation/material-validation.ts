import { z } from "zod";

export const MaterialScheme = z.object({
  part_id: z.string().regex(/^[\w-]+$/i),
  name: z.string().min(1),
  no_material: z.string().min(1),
  qty: z.number().positive(),
});
