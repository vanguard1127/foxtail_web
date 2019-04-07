const milesToKilometers = (distance, distanceMetric) => {
  if (distanceMetric === "km") return Math.floor(distance / 0.621371);
  return distance;
};

export default milesToKilometers;
