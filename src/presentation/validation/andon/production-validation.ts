import { Part } from "@/infrastructure/database/models";
import moment from "moment";
import { z } from "zod";

export const manualPOCreateScheme = z.object({
    partId: z.string().refine(
        async (val) => {
            const part = await Part.findByPk(val);
            if (!part) return false;
            return val;
        },
        { message: "Part not found" }
    ),
    qty: z.number(),
    purpose: z.string(),
    startTime: z.preprocess((val) => (val ? moment(val, "DD-MM-YYYY").toDate() : moment().toDate()), z.date()),
    finishTime: z.preprocess((val) => (val ? moment(val, "DD-MM-YYYY").toDate() : moment().toDate()), z.date()),
});

const poCreateScheme = z.object({
    scheduleId: z.string(),
    qty: z.number(),
    purpose: z.string(),
});
export const payloadPOCreateScheme = z.array(poCreateScheme);

const setEquipmentScheme = z.object({
    equipmentId: z.string(),
    note: z.string(),
});

export const payloadSetEquipmentScheme = z.array(setEquipmentScheme);

const setManpowerScheme = z.object({
    id: z.string(),
    indicator: z.union([z.literal("existing"), z.literal("subtitution"), z.literal("absent")]),
});

export const payloadSetManpowersScheme = z.array(setManpowerScheme);
