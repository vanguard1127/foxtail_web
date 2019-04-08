const milesToKilometers = (distance, distanceMetric) => {
  if (distanceMetric === "km") return Math.floor(distance / 0.621371);
  return distance;
};

const formatedMilesToKm = (distance, distanceMetric, t) => {
  return `${milesToKilometers(distance, distanceMetric)} ${t(
    "common:" + (distanceMetric === "mi" ? "miles" : "kilometers")
  )}`;
};

export default milesToKilometers;
export { formatedMilesToKm };
