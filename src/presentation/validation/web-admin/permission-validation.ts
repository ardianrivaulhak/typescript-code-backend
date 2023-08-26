import { z } from "zod";

export const permissionCreateScheme = z.object({
  name: z.string(),
});

export const permissionUpdateScheme = z.object({
  name: z.string(),
});

export const permissionDataTableScheme = z.object({
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
