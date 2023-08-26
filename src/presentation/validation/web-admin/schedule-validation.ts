import moment from "moment";
import { z } from "zod";

export const scheduleCreateScheme = z.object({
    partId: z.string(),
    lineId: z.string(),
    poNumber: z.string(),
    startDate: z.preprocess((val) => val? moment(val, "DD-MM-YYYY").toDate() : moment().toDate(), z.date()),
    endDate: z.preprocess((val) => val? moment(val, "DD-MM-YYYY").toDate() : moment().toDate(), z.date()),
    qty: z.preprocess((val) => Number(val), z.number()).transform((value) => value ?? undefined),
});

export const scheduleUpdateScheme = z.object({
    partId: z.string(),
    lineId: z.string(),
    poNumber: z.string(),
    startDate: z.preprocess((val) => val? moment(val, "DD-MM-YYYY").toDate() : moment().toDate(), z.date()),
    endDate: z.preprocess((val) => val? moment(val, "DD-MM-YYYY").toDate() : moment().toDate(), z.date()),
    qty: z.preprocess((val) => Number(val), z.number()).transform((value) => value ?? undefined),
    balance: z.preprocess((val) => Number(val), z.number()).transform((value) => value ?? undefined),
    status: z.enum(["open", "closed"]),
});

export const scheduleDataTableScheme = z.object({
    page: z
        .preprocess((val) => Number(val), z.number())
        .nullish()
        .transform((value) => value ?? undefined),
    limit: z
        .preprocess((val) => Number(val), z.number())
        .nullish()
        .transform((value) => value ?? undefined),
    search: z
        .string()
        .nullish()
        .transform((value) => value ?? undefined),
});
