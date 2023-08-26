import { z } from "zod";

export const paginationScheme = z.object({
  search: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
    sortBy: z
    .enum(['asc','desc'])
    .nullish()
    .transform((value) => value ?? "desc"),
    orderBy: z
    .string()
    .nullish()
    .transform((value) => value ?? "createdAt"),
  page: z
    .preprocess((val) => Number(val), z.number())
    .nullish()
    .transform((value) => value ?? undefined),
  limit: z
    .preprocess((val) => Number(val), z.number())
    .nullish()
    .transform((value) => value ?? undefined),
  line: z
    .array(z.string())
    .nullish()
,
  method: z
  .array(z.string())
  .nullish(),
  machine: z
  .array(z.string())
  .nullish(),
  position: z
  .array(z.string())
  .nullish(),
});
