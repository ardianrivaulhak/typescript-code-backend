import { z } from "zod";
import { IMulterFile } from "./types";

export const lineCreateScheme = z.object({
  no_line: z
    .any()
    .refine((val) => parseInt(val) > -1, "no_line must be number")
    .transform((val) => (parseInt(val) > 0 ? parseInt(val) : 1)),
  name: z.string(),
  layout_url: z
    .any()
    .nullish()
    .refine((val) => typeof val === "object" || !val, "Avatar is required")
    .transform((val) => <IMulterFile>val),
});

export const lineUpdateScheme = z.object({
  no_line: z
    .any()
    .refine((val) => parseInt(val) > -1, "no_line must be number")
    .transform((val) => (parseInt(val) > 0 ? parseInt(val) : 1)),
  name: z.string(),
  layout_url: z
    .any()
    .nullish()
    .refine((val) => typeof val === "object" || !val, "Avatar is required")
    .transform((val) => <IMulterFile>val),
});
