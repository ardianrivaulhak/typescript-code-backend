import { z } from "zod";

export const accessCreateScheme = z.object({
  name: z.string(),
});

export const accessUpdateScheme = z.object({
  name: z.string(),
});

export const accessDataTableScheme = z.object({
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
