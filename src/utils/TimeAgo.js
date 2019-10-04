import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const localeObject = {
  relativeTime: {
    // relative time format strings, keep %s %d as the same
    future: "in %s", // e.g. in 2 hours, %s been replaced with 2hours
    past: "%s ago",
    s: "<1 min",
    m: "a min",
    mm: "%d mins",
    h: "an hr",
    hh: "%d hrs", // e.g. 2 hours, %d been replaced with 2
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
};

function TimeAgo(updatedAt) {
  if (dayjs(updatedAt).isAfter(dayjs().subtract(1, "week"))) {
    return dayjs(updatedAt)
      .locale(localeObject, null, true)
      .fromNow()

      .toString();
  } else {
    return dayjs(updatedAt)
      .format("MMM Do")
      .toString();
  }
}

export default TimeAgo;
