import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

function TimeAgo(updatedAt) {
  if (dayjs(updatedAt).isAfter(dayjs().subtract(1, 'week'))) {
    return dayjs(updatedAt)
      .locale(localStorage.getItem('i18nextLng'))
      .fromNow()
      .toString();
  } else {
    return dayjs(updatedAt)
      .locale(localStorage.getItem('i18nextLng'))
      .format('MMM Do')
      .toString();
  }
}
export default TimeAgo;
