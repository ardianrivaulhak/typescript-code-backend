import { z } from "zod";

export const ProblemCreateScheme = z.object({
    name: z.string(),
});

export const ProblemUpdateScheme = z.object({
    name: z.string(),
});

export const ProblemsArrayCreateScheme = z.array(ProblemCreateScheme);
