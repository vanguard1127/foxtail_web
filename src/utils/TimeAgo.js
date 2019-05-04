import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
