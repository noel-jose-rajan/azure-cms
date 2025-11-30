import { z } from "zod";
import { themeSchema } from "../../validators/theme";

export type ThemeType = z.infer<typeof themeSchema>