import { dateToString, stringToDate, secondsToString } from "../../utils/date";

export default {
  filter: {
    dateToString: (val: Date | string, fmt = "yyyy-MM-dd") => {
      if (val instanceof Date) {
        return dateToString.call(val, fmt);
      }
      return dateToString.call(
        new Date(val?.substring(0, 10) || "1990-01-01"),
        fmt
      );
    },
    stringToDate: (val: string, separator = "-") => {
      if (val) {
        return stringToDate(val || "1990-01-01", separator);
      }
      return val;
    },
    secondsToString: (val: number | string, fmt = "mm:ss") => {
      return secondsToString.call(parseInt(val.toString()), fmt);
    },
  },
};
