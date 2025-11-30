export class StringHelper {
  public static replaceSpecialCharacters(value: string) {
    return value.replace(/[\.\!\@\#\$\%\^\&\"\'\(\)\*\s\+\-\\\/]/g, "_");
  }

  public static getExtension(value: string) {
    if (value.lastIndexOf(".") == -1) {
      return "pdf";
    } else {
      return value
        .substring(value.lastIndexOf(".") + 1, value.length)
        .toLowerCase();
    }
  }
}
