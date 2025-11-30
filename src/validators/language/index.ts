import { z } from "zod";

export const languageValidatorSchema = z.enum(['en-INT', 'ar-KW'])