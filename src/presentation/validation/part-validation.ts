import { Line } from "@/infrastructure/database/models";
import { z } from "zod";

const lineIdExistsInDatabase = async (line_id: string) => {
    const line = await Line.findOne({ where: { id: line_id } });
    return !!line;
};

export const PartCreateScheme = z.object({
    line_id: z.string(),
    method_id: z.array(z.string()),
    name: z.string(),
    no_part: z.string(),
    cycle_time: z.number(),
});

export const PartUpdateScheme = z.object({
    line_id: z.string(),
    method_id: z.array(z.string()),
    name: z.string(),
    no_part: z.string(),
    cycle_time: z.number(),
});
