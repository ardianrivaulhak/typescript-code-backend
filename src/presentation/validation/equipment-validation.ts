import { z } from "zod";

export const EquipmentScheme = z.object({
  part_id: z.string(),
  name: z.string().min(1),
  no_equipment: z.string().min(1),
});
