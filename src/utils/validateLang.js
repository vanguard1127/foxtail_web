import { availableLangs } from "../../src/docs/consts";
const validateLang = lang => {
  if (availableLangs.indexOf(lang) < 0) {
    lang = "en";
  }
  return lang;
};

export default validateLang;
