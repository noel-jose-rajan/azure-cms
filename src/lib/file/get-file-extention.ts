export function getExtensionFromContentType(contentType: string): string {
  const typeMap: Record<string, string> = {
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ".xlsx",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "text/plain": ".txt",
    "text/csv": ".csv",
    "text/html": ".html",
    "application/json": ".json",
    "application/zip": ".zip",
    "application/octet-stream": ".bin",
    "image/tiff": ".tiff",
  };

  const cleanType = contentType.split(";")[0].trim(); // strip charset etc.

  if (cleanType in typeMap) {
    return typeMap[cleanType];
  }

  if (cleanType.startsWith("image/")) {
    return `.${cleanType.split("/")[1]}`;
  }

  return ".bin"; // default fallback
}

export function getContentTypeFromExtension(extension: string): string {
  const extMap: Record<string, string> = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".txt": "text/plain",
    ".csv": "text/csv",
    ".html": "text/html",
    ".json": "application/json",
    ".zip": "application/zip",
    ".bin": "application/octet-stream",
    ".tiff": "image/tiff",
  };

  const normalizedExt = extension.trim().toLowerCase();

  return extMap[normalizedExt] || "application/octet-stream"; // default fallback
}
