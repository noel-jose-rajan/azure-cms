import { AxiosRequestConfig } from "axios";
import apiRequest from "../../lib/api";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";
import ENV from "../../constants/env";
import { z } from "zod";

export const phoneNumberRegex =
  /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{5,15}$/;

export const numberOnlyRegex = /^\d{2,10}$/;

const searchResultStatisticsSchema = z.object({
  resultStatistics: z.object({
    "Result Count": z.number(),
  }),
});

//not used
const externalEntitySchema = z.object({
  externalEntityId: z.number(),
  code: z.string(),
  email: z.string().nullable(),
  fax: z.string().nullable(),
  desc: z.string().nullable(),
  phone: z.string().nullable(),
  isActive: z.enum(["1", "2"]),
  descAr: z.string(),
  descEn: z.string(),
  shortName: z.string().nullable(),
  classifyPickListCode: z.string(),
  g2gCode: z.string().nullable(),
  g2gBranch: z.string().nullable(),
  links: z.array(z.any()),
});

const searchResultContentSchema = z.array(externalEntitySchema);

// not used
export const entitySearchResultSchema = z.object({
  searchResultStatistics: searchResultStatisticsSchema,
  searchResultContent: searchResultContentSchema,
});

// not used
export const createExternalEntitySchema = z.object({
  classifyPickListCode: z.string({
    message: "Please select a External entity type",
  }),
  descAr: z
    .string()
    .min(2, "The External entity Arabic value is too short")
    .max(50, "The External entity Arabic value is too long"),
  descEn: z
    .string()
    .min(2, "The External entity english value is too short")
    .max(50, "The External entity english value is too long"),
  email: z.string().email().optional(),
  fax: z
    .string()
    .regex(phoneNumberRegex, {
      message: "Wrong phone format, use 0-9 + - . space",
    })
    .optional(),
  g2gCode: z.string().max(100, "Phone give code is too long").optional(),
  g2gBranch: z.string().optional(),
  shortName: z
    .string()
    .regex(numberOnlyRegex, {
      message: "Wrong phone format, use 0-9",
    })
    .optional(),
  phone: z
    .string()
    .regex(phoneNumberRegex, {
      message: "Wrong phone format, use 0-9 + - . space",
    })
    .min(5, "Please enter valid number")
    .max(20, "Phone number is too long")
    .optional(),
  // isActive: z.enum(["1", "2"]).optional(),
  isActive: z.any(),
  desc: z.string().optional(),
  externalEntityId: z.string().optional(),
});

//used
const messages = {
  en: {
    classify_id: "Please select an External entity type",
    abbr: "use 0-9",
    name_ar_min: "The External entity Arabic value is too short",
    name_ar_max: "The External entity Arabic value is too long",
    name_en_min: "The External entity English value is too short",
    name_en_max: "The External entity English value is too long",
    phone_regex: "Wrong phone format, use 0-9 + - . space",
    phone_min: "Please enter a valid number",
    phone_max: "Phone number is too long",
    fax_regex: "Wrong phone format, use 0-9 + - . space",
    g2g_code_max: "Phone give code is too long",
    email: "Invalid email",
    required: "This field is required",
  },
  ar: {
    classify_id: "يرجى اختيار نوع الجهة الخارجية",
    abbr: "استخدم الأرقام فقط",
    name_ar_min: "قيمة اسم الجهة الخارجية بالعربية قصيرة جدًا",
    name_ar_max: "قيمة اسم الجهة الخارجية بالعربية طويلة جدًا",
    name_en_min: "قيمة اسم الجهة الخارجية بالإنجليزية قصيرة جدًا",
    name_en_max: "قيمة اسم الجهة الخارجية بالإنجليزية طويلة جدًا",
    phone_regex: "تنسيق الهاتف غير صحيح، استخدم 0-9 + - . فراغ",
    phone_min: "يرجى إدخال رقم صحيح",
    phone_max: "رقم الهاتف طويل جدًا",
    fax_regex: "تنسيق الفاكس غير صحيح، استخدم 0-9 + - . فراغ",
    g2g_code_max: "رمز G2G طويل جدًا",
    email: " البريد الإلكتروني غير صالح",
    required: "هذه الحقل مطلوبه",
  },
};

export const getExEntitySchema = (lang: "en" | "ar") => {
  const t = messages[lang];

  return z.object({
    entity_code: z.string().optional(),
    classify_id: z.number({ message: t.classify_id }),
    abbr: z.string().regex(numberOnlyRegex, { message: t.abbr }).optional(),
    name_ar: z
      .string({ message: t.required })
      .min(2, t.name_ar_min)
      .max(50, t.name_ar_max),
    name_en: z
      .string({ message: t.required })
      .min(2, t.name_en_min)
      .max(50, t.name_en_max),
    is_active: z.boolean().optional(),
    email: z.string().email({ message: t.email }).optional(),
    phone: z
      .string()
      .regex(phoneNumberRegex, { message: t.phone_regex })
      .min(5, t.phone_min)
      .max(20, t.phone_max)
      .optional(),
    fax: z
      .string()
      .regex(phoneNumberRegex, { message: t.fax_regex })
      .optional(),
    g2g_code: z.string().max(100, t.g2g_code_max).optional(),
    id: z.string().optional(),
    name: z.string().optional(),
    g2gBranch: z.string().optional(),
  });
};

// export const createExEntitySchema = z.object({
//   entity_code: z.string().optional(),
//   classify_id: z.number({
//     message: "Please select a External entity type",
//   }),
//   abbr: z
//     .string()
//     .regex(numberOnlyRegex, {
//       message: "Wrong phone format, use 0-9",
//     })
//     .optional(),
//   name_ar: z
//     .string()
//     .min(2, "The External entity Arabic value is too short")
//     .max(50, "The External entity Arabic value is too long"),
//   name_en: z
//     .string()
//     .min(2, "The External entity english value is too short")
//     .max(50, "The External entity english value is too long"),
//   is_active: z.boolean().optional(),
//   email: z.string().email().optional(),
//   phone: z
//     .string()
//     .regex(phoneNumberRegex, {
//       message: "Wrong phone format, use 0-9 + - . space",
//     })
//     .min(5, "Please enter valid number")
//     .max(20, "Phone number is too long")
//     .optional(),
//   fax: z
//     .string()
//     .regex(phoneNumberRegex, {
//       message: "Wrong phone format, use 0-9 + - . space",
//     })
//     .optional(),
//   g2g_code: z.string().max(100, "Phone give code is too long").optional(),
//   id: z.string().optional(),
//   name: z.string().optional(),
//   g2gBranch: z.string().optional(),
// });

export const fileUploadStatusSchema = z.object({
  failedRowsErrors: z.array(z.any()),
  logFileName: z.string(),
  noOfRows: z.number(),
  resultCode: z.number(),
  successfullyRows: z.number(),
});

// not used
const searchContentSchema = z.object({
  exact_match: z.array(externalEntitySchema),
  semi_match: z.array(externalEntitySchema),
});

// not used
export const fieldValidationResultSchema = z.object({
  searchContent: searchContentSchema,
});

export type EntityFieldValidationType = z.infer<
  typeof fieldValidationResultSchema
>;

export type CreateExternalEntityType = z.infer<
  typeof createExternalEntitySchema
>;

//used
const createExEntitySchema = getExEntitySchema("en");
export type ExternalEntity = z.infer<typeof createExEntitySchema>;

//not used
export type ExternalEntityType = z.infer<typeof externalEntitySchema>;
export type EntitySearchResultType = z.infer<typeof entitySearchResultSchema>;
export type TemplateUploadStatusType = z.infer<typeof fileUploadStatusSchema>;

let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

//not used
export const getAllExternalEntities = async (
  payLoad: any = {},
  perPage: number = 10,
  pageNumber: number = 0
): Promise<EntitySearchResultType | null> => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/external-entity/search?page=${pageNumber}&size=${perPage}&sort=descAr,asc`,
      payLoad,
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response as unknown as EntitySearchResultType;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const updateTheStatusOfExternalEntity = async (
  jsonPayload: any[]
): Promise<any | null> => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "PUT",
      `/external-entity/bulk-active-status`,
      jsonPayload,
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const deleteAExternalEntity = async (
  id: number
): Promise<any | null> => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "DELETE",
      `/external-entity/${id}`,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const checkIfAlreadyExist = async (
  payLoad: any
): Promise<EntityFieldValidationType | null> => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/external-entity/check_duplicate`,
      payLoad,
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response as unknown as EntityFieldValidationType;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const createNewExternalEntity = async (
  payLoad: CreateExternalEntityType
): Promise<any | null> => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/external-entity/create`,
      payLoad,
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const updateExternalEntity = async (
  id: number,
  payLoad: CreateExternalEntityType
): Promise<any | null> => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "PUT",
      `/external-entity/update?id=${id}`,
      payLoad,
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const templateFileUpload = async (
  file: File
): Promise<TemplateUploadStatusType | null> => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
      responseType: "blob",
      "Content-Type": "multipart-formdata",
    };

    const formData = new FormData();
    formData.append("file", file);

    const response = await apiRequest(
      "POST",
      `/external-entity/upload`,
      formData,
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response as unknown as TemplateUploadStatusType;
    }

    return null;
  } catch (error) {
    console.log("the response ", error);
    return null;
  }
};

export const downloadEntityTemplate = async () => {
  try {
    const response = await fetch(
      ENV.API_URL_LEGACY + "/external-entity/download-template?format=xlsx",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "external_entity.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return blob;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const downloadLogFile = async (filename: string) => {
  try {
    const url =
      ENV.API_URL_LEGACY +
      `/external-entity/download-upload-log-file?fileName=${filename}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }
    const textContent = await response.text();

    const blob = new Blob([textContent], { type: "text/plain" });

    const fileURL = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", filename);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(fileURL);

    return blob;
  } catch (error) {
    return null;
  }
};

export const getAnEntityWithCode = async (
  code: string
): Promise<ExternalEntityType | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/external-entity/filter?code=${code}`,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    return null;
  }
};
