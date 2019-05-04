import { availableLangs } from "../docs/consts";
const getLang = () => {
  let lang = localStorage.getItem("i18nextLng");
  if (availableLangs.indexOf(lang) < 0) {
    lang = "en";
  }
  return lang;
};

export default getLang;
