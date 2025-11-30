import { z } from "zod";
import { userSchema } from "../../validators/user";

export type UserType = z.infer<typeof userSchema>;