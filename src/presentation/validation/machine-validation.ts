import { z } from "zod";

export const MachineCreateScheme = z.object({
    no_machine: z.number().positive("The machine number must be positive"),
    name: z.string().min(3, "The name must be at least 3 characters long"),
    line_id: z.string(),
});

export const MachineUpdateScheme = z.object({
    no_machine: z.number().optional(),
    name: z.string().min(3, "The name must be at least 3 characters long").optional(),
    line_id: z.string(),
});
