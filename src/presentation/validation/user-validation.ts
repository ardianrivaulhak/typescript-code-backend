import { z } from "zod";
import { IMulterFile } from "./types";

export const userCreateScheme = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  isActive: z
    .any()
    .refine((val) => !(!val || val == "0" || val == "false" || val == ""), "Is Active must boolean")
    .transform((val) => !!val),
  roleId: z.string(),
  photoUrl: z
    .any()
    .nullish()
    .refine((val) => typeof val === "object", "Avatar is required")
    .transform((val) => <IMulterFile>val),
});

export const userUpdateScheme = z.object({
  email: z.string().email(),
  password: z.any().transform((val) => <string | undefined>val),
  name: z.string(),
  isActive: z
    .any()
    .refine((val) => ["0", "1", true, false].includes(val), "Is Active must boolean")
    .transform((val) => !!(val === "1" || val === true)),
  roleId: z.string(),
  photoUrl: z
    .any()
    .nullish()
    .refine((val) => typeof val === "object" || !val, "Avatar is required")
    .transform((val) => <IMulterFile>val),
});

export const userDataTableScheme = z.object({
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
export const mobileChangePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });
