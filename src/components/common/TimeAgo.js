import moment from "moment";

function TimeAgo(item) {
  var duration = moment.duration(
    moment(Date.now()).diff(moment(item.participants[0].updatedAt))
  );
  var minutes = duration.minutes();

  if (minutes < 20) {
    return "Online";
  } else if (minutes < 10080) {
    return moment(item.createdAt)
      .fromNow()
      .toString();
  } else {
    return moment(item.createdAt)
      .format("MMM Do")
      .toString();
  }
}
export default TimeAgo;
