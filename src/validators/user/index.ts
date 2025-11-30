import { z } from "zod";

export const userSchema = z.object({
    uid: z.string(),
    cn: z.string(),
    sn: z.string(),
    mail: z.string(),
    title: z.string(),
});

