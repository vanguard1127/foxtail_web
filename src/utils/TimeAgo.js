import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

function TimeAgo(updatedAt) {
  if (dayjs(updatedAt).isAfter(dayjs().subtract(1, "week"))) {
    return dayjs(updatedAt)
      .fromNow()
      .toString();
  } else {
    return dayjs(updatedAt)
      .format("MMM Do")
      .toString();
  }
}
export default TimeAgo;
