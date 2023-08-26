import { z } from "zod";

export const roleUpdateAccessAndPermissionScheme = z.object({
  accessId: z.string().transform((value) => value ?? ""),
  permissionsId: z.string().transform((value) => value ?? ""),
  status: z.boolean(),
});

export const roleCreateScheme = z.object({
  name: z.string(),
});

export const roleUpdateScheme = z.object({
  name: z.string(),
});

export const roleDataTableScheme = z.object({
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
