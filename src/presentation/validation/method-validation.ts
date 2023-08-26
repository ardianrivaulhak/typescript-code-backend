import { z } from "zod";
import { IMulterFile } from "./types";

export const methodCreateScheme = z.object({
    name: z.string(),
    no_method: z.string(),
    file_url: z
        .any()
        .nullish()
        .refine((val) => typeof val === "object" || !val, "Avatar is required")
        .transform((val) => <IMulterFile>val),
});

export const methodUpdateScheme = z.object({
    name: z.string(),
    no_method: z.string(),
    file_url: z
        .any()
        .nullish()
        .refine((val) => typeof val === "object" || !val, "Avatar is required")
        .transform((val) => <IMulterFile>val),
});
