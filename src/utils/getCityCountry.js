import axios from 'axios';
const getCityCountry = async ({ long, lat }) => {
  let city = '';
  let country = '';
  let url =
    'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
    lat +
    ',' +
    long +
    '&key=AIzaSyDnhLDPrsj8UPJILV7owGD3aKo_fCyllFY';

  const resp = await axios.get(url);

  resp.data.results[0].address_components.forEach(el => {
    if (el.types[0] === 'locality') {
      city += el.long_name + ', ';
    } else if (el.types[0] === 'administrative_area_level_1') {
      city += el.long_name + ', ';
    } else if (el.types[0] === 'country') {
      city += el.short_name;
      country += el.short_name;
    }
  });
  return { city, country };
};
export default getCityCountry;
