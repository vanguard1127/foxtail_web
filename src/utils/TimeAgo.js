import moment from 'moment';

function TimeAgo(updatedAt) {
  var duration = moment.duration(moment(Date.now()).diff(moment(updatedAt)));
  var minutes = duration.minutes();

  if (minutes < 10080) {
    return moment(updatedAt)
      .locale(localStorage.getItem('i18nextLng'))
      .fromNow()
      .toString();
  } else {
    return moment(updatedAt)
      .locale(localStorage.getItem('i18nextLng'))
      .format('MMM Do')
      .toString();
  }
}
export default TimeAgo;
