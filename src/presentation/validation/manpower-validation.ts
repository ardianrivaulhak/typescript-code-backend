import { z } from "zod";

export const ManpowerScheme = z.object({
  machineId: z.string().regex(/^[\w-]+$/i),
  positionId: z.string().regex(/^[\w-]+$/i),
  fullname: z.string().min(1),
  shortname: z.string().min(1),
  nip: z.string().min(1),
});
