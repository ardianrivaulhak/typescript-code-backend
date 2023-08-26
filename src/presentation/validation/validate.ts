import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { z } from "zod";

export const validate = (scheme: z.AnyZodObject, source: any) => {
    const parsedData = scheme.safeParse(source);
    if (!parsedData.success) {
        throw new AppError({
            statusCode: HttpCode.VALIDATION_ERROR,
            description: "Validation Failed",
            data: {
                ...parsedData.error.flatten().fieldErrors,
                ...parsedData.error.flatten().formErrors,
            },
        });
    }
    return parsedData.data;
};
