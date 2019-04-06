const milesToKilometers = value => {
  if (value === "km") return Math.floor(value / 0.621371);
  return value;
};

export default milesToKilometers;
