import axios from "axios";
const getCityCountry = async ({ long, lat }) => {
  let city = "";
  let country = "";
  let url =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    lat +
    "," +
    long +
    "&key=AIzaSyBC3bHXntRh9XhG1FixhV_Hc3P7JKYP0w4";

  const resp = await axios.get(url);

  if (resp.data.status !== "ZERO_RESULTS") {
    resp.data.results[0].address_components.forEach(el => {
      if (el.types[0] === "locality") {
        city += el.long_name + ", ";
      } else if (el.types[0] === "administrative_area_level_1") {
        city += el.long_name + ", ";
      } else if (el.types[0] === "country") {
        city += el.short_name;
        country += el.short_name;
      }
    });
    return { city, country };
  }
  return null;
};
export default getCityCountry;
