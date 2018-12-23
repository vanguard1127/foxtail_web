import moment from "moment";

//TODO: is this the best way to get most recent user
function TimeAgo(updatedAt) {
  var duration = moment.duration(moment(Date.now()).diff(moment(updatedAt)));
  var minutes = duration.minutes();

  if (minutes < 20) {
    return "Online";
  } else if (minutes < 10080) {
    return moment(updatedAt)
      .fromNow()
      .toString();
  } else {
    return moment(updatedAt)
      .format("MMM Do")
      .toString();
  }
}
export default TimeAgo;
