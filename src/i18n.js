import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

// translations are already at
// '../public/locales/en/translation.json'
// which is the default for the xhr backend to load from

i18n
  .use(backend)
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: "en", // use en if detected lng is not available
    keySeparator: false, // we do not use keys in form messages.welcome
    saveMissing: false, // send not translated keys to endpoint
    whitelist: ["en"],
    load: "languageOnly",
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    ns: ["common", "searchprofiles", "landing"],
    // react-i18next options
    react: {
      useSuspense: false,
      wait: true
    }
  });
export default i18n;
