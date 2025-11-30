import moment from "moment";

export const convertDateFormat = (date: string) => {
  return moment(date, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY hh:mm");
};

export class DateHelper {
  public static convertDateFormat(date: string) {
    return moment(date, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY hh:mm");
  }

  public static reverseDateFormat(date: string) {
    return moment(date, "DD-MM-YYYY").format("DD/MM/YYYY hh:mm");
  }

  public static checkDateIsFuture(date: string) {
    return moment(date, "DD-MM-YYYY HH:mm:ss").isAfter(moment());
  }

  public static getTime(date: string) {
    return moment(date, "DD-MM-YYYY HH:mm:ss").unix();
  }

  public static swapFormat(date: string, yearFirst: boolean) {
    if (yearFirst) {
      return moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
    }
    return moment(date, "YYYY-MM-DD").format("DD-MM-YYYY");
  }

  public static getFormattedDatesStartEndDays(type: string) {
    const format = "DD-MM-YYYY";
    const today = moment();

    if (type === "This Month") {
      return {
        startDate: today.startOf("month").format(format),
        endDate: today.endOf("month").format(format),
      };
    }

    if (type === "This Week") {
      return {
        startDate: today.startOf("week").format(format),
        endDate: today.endOf("week").format(format),
      };
    }

    return {
      startDate: moment().format(format),
      endDate: moment().format(format),
    };
  }
}
