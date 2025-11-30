import { z } from "zod"
import { languageValidatorSchema } from "../../validators/language"

export type LanguageType = z.infer<typeof languageValidatorSchema>
